import Scan from "../models/Scan.js";
import QrCode from "../models/QrCode.js";
import { User } from "../models/user.model.js";
import { mintCodaTokens } from "../utils/blockchain.js";

// REDEEM BOTTLE FOR POINTS
export const scanQr = async (req, res) => {
  try {
    const userId = req.userId;
    const { hash } = req.body;

    if (!hash) return res.status(400).json({ message: "Code required" });

    // 1. Find the code in the database
    const qr = await QrCode.findOne({ hash: hash });
    if (!qr) {
      return res.status(404).json({ message: "Invalid code - This bottle is not in our system." });
    }

    // 2. Check if the code is globally active
    if (!qr.isActive) {
      return res.status(400).json({ message: "This code has already been redeemed by someone else." });
    }

    // 3. Find the User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 4. Try to create the Scan History record
    // This will trigger your "Unique Index" if you already scanned this code
    try {
      await Scan.create({
        user: userId,
        qrHash: hash,
        rewardPoints: qr.rewardPoints || 10,
        status: "valid", // Matches your Scan.js schema enum
      });
    } catch (historyError) {
      if (historyError.code === 11000) {
        return res.status(400).json({ message: "You have already claimed this specific bottle!" });
      }
      throw historyError; // Pass other errors to the main catch block
    }

    // 5. Update Database: Give points and deactivate code
    user.points = (user.points || 0) + (qr.rewardPoints || 10);
    qr.isActive = false;

    await user.save();
    await qr.save();

    console.log(`✅ Success: ${qr.rewardPoints} points added to ${user.email}`);

    return res.status(200).json({
      success: true,
      pointsAdded: qr.rewardPoints || 10,
      message: `Success! +${qr.rewardPoints || 10} points added to your balance.`,
    });
  } catch (error) {
    console.error("CRITICAL SCAN ERROR:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// CONVERT POINTS TO CODA (100:1 Ratio)
export const convertPointsToCoda = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.walletAddress || user.walletAddress === "") {
      return res.status(400).json({ message: "Please link your MetaMask wallet first!" });
    }

    if (user.points < 100) {
      return res.status(400).json({ message: "Minimum 100 points required for a Big Prize (1 CODA)." });
    }

    // Calculation: 100 points = 1 CODA Token
    const pointsToDeduct = Math.floor(user.points / 100) * 100;
    const tokensToMint = pointsToDeduct / 100;

    console.log(`--- Requesting Blockchain Mint: ${tokensToMint} CODA ---`);

    // 1. Trigger Blockchain Transaction
    const txHash = await mintCodaTokens(user.walletAddress, tokensToMint);

    if (!txHash) {
      return res.status(500).json({ 
        message: "Blockchain transaction failed. Please ensure you have Sepolia network access." 
      });
    }

    // 2. Update User Database ONLY after blockchain success
    user.points -= pointsToDeduct;
    user.codaBalance = (user.codaBalance || 0) + tokensToMint;
    await user.save();

    console.log(`✅ Conversion Success: ${tokensToMint} CODA minted. Tx: ${txHash}`);

    res.status(200).json({
      success: true,
      message: `Successfully minted ${tokensToMint} CODA Tokens to your wallet!`,
      txHash,
      newPoints: user.points,
      newCodaBalance: user.codaBalance
    });
  } catch (error) {
    console.error("CONVERSION ERROR:", error);
    res.status(500).json({ message: "Internal Server Error during conversion." });
  }
};

// LINK WALLET TO PROFILE
export const updateWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress || !walletAddress.startsWith("0x")) {
        return res.status(400).json({ message: "Please provide a valid Ethereum address." });
    }
    
    await User.findByIdAndUpdate(req.userId, { walletAddress });
    res.status(200).json({ success: true, message: "MetaMask wallet linked successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error linking wallet" });
  }
};