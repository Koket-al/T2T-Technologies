import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // future
      required: false,
    },

    rewardPoints: {
      type: Number,
      default: 10,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QrCode", qrCodeSchema);
