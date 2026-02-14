import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireStacksPayment } from "../middleware/x402Gate.js";
import { 
    scanQr, 
    updateWallet, 
    convertPointsToBirr, 
    checkProductSafety, 
    unlockSafetyData, 
    processWithdrawal 
} from "../controllers/scan.controller.js";

const router = express.Router();

// Publicly free routes
router.post("/scan", verifyToken, scanQr);
router.post("/convert", verifyToken, convertPointsToBirr);

// ✅ x402 Premium Safety Routes
router.post("/safety-check", verifyToken, checkProductSafety);
router.post("/unlock-safety", verifyToken, unlockSafetyData); // Verification route

// Identity & Liquidity
router.put("/update-wallet", verifyToken, updateWallet);
router.post("/withdraw", verifyToken, processWithdrawal);

export default router;