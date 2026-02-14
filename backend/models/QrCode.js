import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ✅ NEW: DISTINGUISH BETWEEN CAP AND BOTTLE BODY
    codeType: { 
        type: String, 
        enum: ["CAP", "BODY"], 
        required: true 
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Points to the Admin/Company
      required: false,
    },

    rewardPoints: {
      type: Number,
      default: 10,
    },

    // ✅ NEW: DIRECT BIRR REWARD FOR DATABASE
    birrReward: {
      type: Number,
      default: 5, // e.g., 5 Birr per scan
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ FOOD SAFETY & REGULATORY FIELDS (Locked behind x402)
    batchNumber: { type: String, required: true },
    mfgDate: { type: String, required: true },
    expDate: { type: String, required: true },
    ingredients: { type: String, required: true },
    isConformityApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("QrCode", qrCodeSchema);