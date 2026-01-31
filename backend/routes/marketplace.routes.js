import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getItems, purchaseItem } from "../controllers/marketplace.controller.js";

const router = express.Router();

router.get("/items", verifyToken, getItems);
router.post("/purchase", verifyToken, purchaseItem);

export default router;