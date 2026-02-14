import { User } from "../models/user.model.js";
import { verifyStacksPayment } from "../utils/stacksVerifier.js";
import LotteryTicket from "../models/LotteryTicket.js"; // ✅ New Import

const LOTTERY_PRIZES = [
  { id: 1, name: "Luxury Car", ticketPrice: 50, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500" },
  { id: 2, name: "Modern House", ticketPrice: 100, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500" },
  { id: 3, name: "Electric Motorbike", ticketPrice: 20, image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=500" },
];

export const getLotteryItems = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const now = new Date();
    const isExpired = user.lotteryAccessExpiresAt && now > user.lotteryAccessExpiresAt;

    if (!user.hasLotteryAccess || isExpired) {
        return res.status(402).json({ 
            success: false, 
            hasAccess: false,
            paymentRequest: { 
                amount: 5000, 
                recipient: process.env.STACKS_ADMIN_ADDRESS,
                memo: "T2T Lottery Access"
            }
        });
    }

    // ✅ Fetch user's active tickets to show on the UI
    const tickets = await LotteryTicket.find({ user: req.userId }).sort({ purchaseDate: -1 });

    res.status(200).json({ 
        success: true, 
        items: LOTTERY_PRIZES, 
        hasAccess: true,
        userTickets: tickets 
    });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

export const unlockLottery = async (req, res) => {
  try {
    const { txId } = req.body;
    if (!txId) return res.status(400).json({ message: "TXID Required" });

    const isPaid = await verifyStacksPayment(txId, 5000, process.env.STACKS_ADMIN_ADDRESS);
    if (!isPaid) return res.status(400).json({ message: "Verification failed" });

    const user = await User.findById(req.userId);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 2);

    user.hasLotteryAccess = true;
    user.lotteryAccessExpiresAt = expiry;
    await user.save();

    res.status(200).json({ success: true, message: "Lottery Room Unlocked" });
  } catch (error) { res.status(500).json({ message: "Unlock failed" }); }
};

export const playLottery = async (req, res) => {
  try {
    const { prizeId } = req.body;
    const user = await User.findById(req.userId);
    const prize = LOTTERY_PRIZES.find(p => p.id === prizeId);

    if (user.birrBalance < prize.ticketPrice) {
        return res.status(400).json({ message: "Insufficient Birr Balance!" });
    }

    // ✅ GENERATE UNIQUE 6-DIGIT LUCKY NUMBER
    const luckyNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Deduct Birr from DB
    user.birrBalance -= prize.ticketPrice;
    await user.save();

    // ✅ CREATE TICKET RECORD
    await LotteryTicket.create({
        user: req.userId,
        prizeName: prize.name,
        ticketNumber: luckyNumber,
        status: "Active"
    });

    res.status(200).json({
      success: true,
      message: "Ticket Purchased Successfully!",
      luckyNumber: luckyNumber, // Send to UI for the popup
      newBalance: user.birrBalance
    });
  } catch (error) { res.status(500).json({ message: "Error generating ticket" }); }
};