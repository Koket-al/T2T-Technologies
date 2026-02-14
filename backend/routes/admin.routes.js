import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { 
  generateBatch, 
  unlockAdminPanel, 
  getBatchHistory, 
  exportBatch,
 
} from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * ✅ T2T ADMIN PROTOCOL ROUTES
 * All routes are protected by JWT verification and Admin role checks.
 */

// 1. Initial Handshake: Check if Admin has a license (402 Gate)
router.get("/check-status", verifyToken, isAdmin);

// 2. License Provisioning: Verify 1 STX Corporate Payment
router.post("/unlock-panel", verifyToken, isAdmin, unlockAdminPanel);

// 3. Production: Generate linked Cap and Body hashes
router.post("/generate-batch", verifyToken, isAdmin, generateBatch);

// 4. Analytics: Fetch all past batches from the ledger
router.get("/batch-history", verifyToken, isAdmin, getBatchHistory);

// 5. Logistics: Export raw hashes for industrial etching
router.get("/export/:batchId", verifyToken, isAdmin, exportBatch);

export default router;