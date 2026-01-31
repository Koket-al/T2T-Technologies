import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    qrHash: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["valid", "duplicate", "expired", "invalid"],
      required: true,
    },

    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent same user scanning same QR twice
scanSchema.index({ user: 1, qrHash: 1 }, { unique: true });

export default mongoose.model("Scan", scanSchema);
