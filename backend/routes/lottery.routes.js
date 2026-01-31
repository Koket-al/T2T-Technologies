import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getLotteryItems, playLottery } from "../controllers/lottery.controller.js";

const router = express.Router();

router.get("/items", verifyToken, getLotteryItems);
router.post("/play", verifyToken, playLottery);

export default router;