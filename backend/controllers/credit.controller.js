import { User } from "../models/user.model.js";
import Scan from "../models/Scan.js";
import { mintCodaTokens } from "../utils/blockchain.js"; // Import our bridge

export const getCreditProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    const totalScans = await Scan.countDocuments({ user: userId, status: "valid" });
    
    // Logic: Every 5 bottles increases credit score by 100 points
    const newScore = 300 + (Math.floor(totalScans / 5) * 100);
    user.creditScore = newScore > 850 ? 850 : newScore;

    // Eligibility: $50 loan for every 100 points of credit score
    user.loanEligibility = Math.floor(user.creditScore / 100) * 50; 

    await user.save();

    res.status(200).json({
      success: true,
      creditScore: user.creditScore,
      loanEligibility: user.loanEligibility,
      totalRecycled: totalScans
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating credit profile" });
  }
};

export const swapCodaToCtc = async (req, res) => {
  try {
    const { codaAmount } = req.body;
    const user = await User.findById(req.userId);

    if (user.codaBalance < codaAmount) {
      return res.status(400).json({ message: "Insufficient CODA balance" });
    }

    const ctcGained = codaAmount / 10;
    user.codaBalance -= codaAmount;
    user.ctcBalance += ctcGained;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Swapped ${codaAmount} CODA for ${ctcGained} CTC!`,
      newCodaBalance: user.codaBalance,
      newCtcBalance: user.ctcBalance
    });
  } catch (error) {
    res.status(500).json({ message: "Swap failed" });
  }
};

export const applyForLoan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // 1. Validation Checks
    if (user.creditScore < 600) {
      return res.status(400).json({ message: "Credit score must be 600+ for loans." });
    }
    if (!user.walletAddress) {
      return res.status(400).json({ message: "Link your MetaMask wallet first to receive funds." });
    }

    const loanAmount = user.loanEligibility;

    // 2. TRIGGER BLOCKCHAIN MINTING
    // This calls the blockchain utility we updated above
    const blockchainResult = await mintCodaTokens(user.walletAddress, loanAmount);

    // 3. CHECK FOR GAS ERROR OR OTHER FAILURES
    if (!blockchainResult.success) {
      // Send the specific error (e.g. INSUFFICIENT ETH) back to the frontend console/toast
      return res.status(400).json({ 
        success: false, 
        message: blockchainResult.error 
      });
    }

    // 4. IF BLOCKCHAIN SUCCESS, UPDATE DATABASE
    user.ctcBalance += loanAmount;
    user.activeLoan = true;
    await user.save();

    console.log(`✅ LOAN SUCCESS: ${loanAmount} CTC sent to ${user.email}. Tx: ${blockchainResult.hash}`);

    res.status(200).json({ 
      success: true, 
      message: `Loan Confirmed! ${loanAmount} CTC added to your wallet.`,
      newBalance: user.ctcBalance,
      txHash: blockchainResult.hash // Send the hash so frontend can link to Etherscan
    });

  } catch (error) {
    console.error("CRITICAL LOAN ERROR:", error);
    res.status(500).json({ message: "Internal server error during loan execution." });
  }
};