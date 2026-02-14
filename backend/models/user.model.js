import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- 1. AUTHENTICATION & IDENTITY ---
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    
    // Email Verification logic
    verificationToken: { type: String },  
    verificationTokenExpiresAt: { type: Date },  
    isVerified: { type: Boolean, default: false },
    
    // Role Control (User vs Admin)
    role: { type: String, enum: ["user", "admin"], default: "user" },
    
    // ✅ T2T-ID: Simple Digital ID for Smart Bin Handshakes (e.g., T2T-5590)
    recyclerId: { 
        type: String, 
        unique: true, 
        default: () => "T2T-" + Math.floor(1000 + Math.random() * 9000) 
    },

    // Password Recovery
    resetPasswordToken: { type: String },  
    resetPasswordExpiresAt: { type: Date },  

    // --- 2. INTERNAL ECONOMY ---
    points: { type: Number, default: 0 },       // Loyalty/Reputation Points
    birrBalance: { type: Number, default: 0 },  // Internal Spendable Currency (MongoDB)
    ctcBalance: { type: Number, default: 0 },   // Global Creditcoin Assets (Blockchain)

    // --- 3. x402 GATEWAY ACCESS TRACKING (USER LEVEL) ---
    hasMarketplaceAccess: { type: Boolean, default: false },
    marketplaceAccessExpiresAt: { type: Date }, 
    hasLotteryAccess: { type: Boolean, default: false },
    lotteryAccessExpiresAt: { type: Date },
    paidSafetyHashes: [{ type: String }], // List of bottle hashes user paid to verify

    // --- 4. B2B CORPORATE LICENSING (ADMIN LEVEL) ---
    // ✅ Tracks if the Admin has paid the 1 STX Corporate License Fee
    isAdminLicensed: { type: Boolean, default: false },

    // --- 5. WALLET & PAYOUT DETAILS ---
    walletAddress: { type: String, default: "" }, // Stacks/Leather Wallet Address
    telebirrNumber: { type: String, default: "" },
    bankAccount: { type: String, default: "" },

    // --- 6. FINANCIAL IDENTITY (CREDITCOIN PROTOCOL) ---
    creditScore: { type: Number, default: 300 },
    loanEligibility: { type: Number, default: 0 },
    activeLoan: { type: Boolean, default: false },

    // --- 7. INDUSTRIAL IOT (SMART BIN) ---
    isSmartBinLocked: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);