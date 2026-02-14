import { verifyStacksPayment } from "../utils/stacksVerifier.js";
import dotenv from "dotenv";
dotenv.config();

export const requireStacksPayment = async (req, res, next) => {
  const paymentId = req.headers["x402-payment-id"];

  if (!paymentId) {
    return res.status(402).json({
      success: false,
      message: "Bitcoin Payment Required",
      paymentRequest: {
        amount: process.env.X402_PRICE || 1000,
        recipient: process.env.STACKS_ADMIN_ADDRESS,
        memo: "T2T Service Unlock"
      }
    });
  }

  const isPaid = await verifyStacksPayment(paymentId, 1000, process.env.STACKS_ADMIN_ADDRESS);
  if (!isPaid) return res.status(402).json({ message: "Payment ID not verified on-chain yet." });

  next();
};