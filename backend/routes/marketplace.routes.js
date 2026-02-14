import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getItems, purchaseItem, unlockMarketplace } from "../controllers/marketplace.controller.js";

const router = express.Router();

// Get items (Will return 402 if locked)
router.get("/items", verifyToken, getItems);

// Unlock Route (Handles the TXID check internally)
router.post("/unlock", verifyToken, unlockMarketplace);

// Purchase Logic
router.post("/purchase", verifyToken, purchaseItem);

export default router;