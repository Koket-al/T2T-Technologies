import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { scanQr, updateWallet, convertPointsToCoda } from "../controllers/scan.controller.js";

const router = express.Router();

// Claim points
router.post("/scan", verifyToken, scanQr);

// Link MetaMask
router.put("/update-wallet", verifyToken, updateWallet);

// Convert Points to Crypto
router.post("/convert", verifyToken, convertPointsToCoda);

export default router;