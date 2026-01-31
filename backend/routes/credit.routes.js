import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getCreditProfile, applyForLoan, swapCodaToCtc } from "../controllers/credit.controller.js";

const router = express.Router();

router.get("/profile", verifyToken, getCreditProfile);
router.post("/apply-loan", verifyToken, applyForLoan);
router.post("/swap", verifyToken, swapCodaToCtc); // ✅ THE SWAP BRIDGE

export default router;