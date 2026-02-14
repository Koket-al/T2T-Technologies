import { User } from "../models/user.model.js";
import Scan from "../models/Scan.js";

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
    if (user.creditScore < 600) {
      return res.status(400).json({ message: "Credit score must be 600+ for loans." });
    }
    
    // 🚀 NOTE: Ethereum minting removed for Stacks Hackathon.
    // Loan is currently added to internal balance.
    const loanAmount = user.loanEligibility;
    user.ctcBalance += loanAmount;
    user.activeLoan = true;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Loan approved and recorded on T2T Stacks Ledger!",
      newBalance: user.ctcBalance
    });
  } catch (error) {
    res.status(500).json({ message: "Loan application failed" });
  }
};