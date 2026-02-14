import Scan from "../models/Scan.js";
import QrCode from "../models/QrCode.js";
import { User } from "../models/user.model.js";
import { verifyStacksPayment } from "../utils/stacksVerifier.js";

// 1. CHECK PRODUCT SAFETY (Paywalled via x402)
export const checkProductSafety = async (req, res) => {
  try {
    const { hash } = req.body;
    const user = await User.findById(req.userId);
    const bottleHash = hash.toUpperCase();

    const qr = await QrCode.findOne({ hash: bottleHash });
    if (!qr) return res.status(404).json({ message: "Product hash not found in global ledger." });

    // Check if user has already paid for this specific bottle safety data
    const hasPaid = user.paidSafetyHashes.includes(bottleHash);

    if (!hasPaid) {
        // TRIGGER x402: Send 402 Payment Required
        return res.status(402).json({
            success: false,
            message: "Bitcoin Payment Required to unlock Safety Passport",
            paymentRequest: {
                amount: 1000, // 0.001 STX
                recipient: process.env.STACKS_ADMIN_ADDRESS,
                memo: `Safety Unlock: ${bottleHash}`
            }
        });
    }

    // DATA UNLOCKED: Return the dynamic data entered by Admin
    res.status(200).json({
      success: true,
      safetyReport: {
        batch: qr.batchNumber,
        mfg: qr.mfgDate,
        exp: qr.expDate,
        ingredients: qr.ingredients,
        approved: qr.isConformityApproved,
        origin: "T2T Technologies Node - Ethiopia",
        certification: "Conformity Assessment Enterprise Certified",
        isRedeemed: !qr.isActive,
        type: qr.codeType
      }
    });
  } catch (error) { 
    res.status(500).json({ message: "Safety Ledger Connection Error" }); 
  }
};

// 2. UNLOCK SAFETY DATA (Fulfills the x402 payment)
export const unlockSafetyData = async (req, res) => {
    try {
      const { txId, hash } = req.body;
      const bottleHash = hash.toUpperCase();
  
      // Verify STX Transaction on the blockchain
      const isPaid = await verifyStacksPayment(txId, 1000, process.env.STACKS_ADMIN_ADDRESS);
      
      if (!isPaid) {
          return res.status(400).json({ message: "Blockchain verification pending or failed." });
      }
  
      const user = await User.findById(req.userId);
      
      // Save hash to user's "Paid" list
      if (!user.paidSafetyHashes.includes(bottleHash)) {
          user.paidSafetyHashes.push(bottleHash);
          await user.save();
      }
  
      res.status(200).json({ success: true, message: "Safety Passport Provisioned!" });
    } catch (error) { 
      res.status(500).json({ message: "Internal Auth Error" }); 
    }
};

// 3. REDEEM BOTTLE (Points & Birr)
export const scanQr = async (req, res) => {
  try {
    const { hash, isAiVerified } = req.body; // isAiVerified is sent only by the Smart Bin
    const qr = await QrCode.findOne({ hash: hash.toUpperCase() });

    if (!qr || !qr.isActive) return res.status(400).json({ message: "Invalid or used code" });

    // 🛑 INDUSTRIAL SECURITY RULE:
    // If the code is a BODY code but the request is NOT from an AI Bin
    if (qr.codeType === "BODY" && !isAiVerified) {
        return res.status(403).json({ 
            message: "REJECTED: This is a Bottle Body code. Please visit an AI Smart Bin to recycle and earn." 
        });
    }

    const user = await User.findById(req.userId);
    
    // Safety check for duplicate scan by THIS user (Unique Index check)
    try {
        await Scan.create({ 
            user: req.userId, 
            qrHash: hash.toUpperCase(), 
            rewardPoints: qr.rewardPoints, 
            status: "valid" 
        });
    } catch (e) {
        if (e.code === 11000) return res.status(400).json({ message: "You already claimed this specific bottle reward!" });
        throw e;
    }

    // Update User and Deactivate Code
    user.points += qr.rewardPoints;
    qr.isActive = false; 
    
    await user.save();
    await qr.save();

    res.status(200).json({ 
        success: true, 
        pointsAdded: qr.rewardPoints, 
        message: qr.codeType === "CAP" ? "Loyalty points added!" : "AI Recycling points added!" 
    });
  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ message: "Server error during redemption" });
  }
};

// 4. CONVERT POINTS TO BIRR
export const convertPointsToBirr = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.points < 100) return res.status(400).json({ message: "Minimum 100 points needed for conversion." });

    const birrEarned = Math.floor(user.points / 1);
    user.birrBalance += birrEarned;
    user.points = 0; 
    await user.save();

    res.status(200).json({ 
        success: true, 
        newPoints: 0, 
        newBirrBalance: user.birrBalance, 
        birrEarned,
        message: `Successfully converted to ${birrEarned} Birr!`
    });
  } catch (e) { res.status(500).json({ message: "Conversion failed" }); }
};

// 5. UPDATE WALLET
export const updateWallet = async (req, res) => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress || !walletAddress.startsWith("ST")) {
          return res.status(400).json({ message: "Invalid Stacks Address" });
      }
      await User.findByIdAndUpdate(req.userId, { walletAddress });
      res.status(200).json({ success: true, message: "Stacks Identity Synced" });
    } catch (error) { res.status(500).json({ message: "Identity link failed" }); }
};

// 6. WITHDRAW TOKENS (Sell for Cash)
export const processWithdrawal = async (req, res) => {
    try {
      const { amount, method, details, tokenType } = req.body; 
      const user = await User.findById(req.userId);
      
      // Fixed: Sell only from Coins (CODA/CTC), not points
      const balanceKey = tokenType === "CTC" ? "ctcBalance" : "codaBalance";
      
      if (user[balanceKey] < amount) return res.status(400).json({ message: `Insufficient ${tokenType} balance` });
  
      user[balanceKey] -= amount;
      await user.save();
      
      res.status(200).json({ 
          success: true, 
          message: "Withdrawal Successful", 
          newBirrBalance: user.birrBalance, 
          newCtcBalance: user.ctcBalance,
          receipt: {
            txRef: "T2T-" + Math.random().toString(36).substring(7).toUpperCase(),
            amountETB: (amount * 5.0).toFixed(2),
            phone: details,
            method: method
          }
      });
    } catch (e) { res.status(500).json({ message: "Payment Gateway Error" }); }
};