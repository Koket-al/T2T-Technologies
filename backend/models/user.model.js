import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    // Database loyalty points
    points: { type: Number, default: 0 },
    // Blockchain data
    walletAddress: { type: String, default: "" },
    codaBalance: { type: Number, default: 0 },
    // ✅ NEW: CREDITCOIN (CTC) GLOBAL BALANCE
    ctcBalance: { type: Number, default: 0 }, 
    
    creditScore: { type: Number, default: 300 },
    loanEligibility: { type: Number, default: 0 },
    activeLoan: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);