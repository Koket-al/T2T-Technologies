import { User } from "../models/user.model.js";

const LOTTERY_ITEMS = [
  { id: 1, name: "Luxury Car", price: 1, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500", chance: 0.001 }, // 0.1% chance
  { id: 2, name: "Modern House", price: 10, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500", chance: 0.0005 }, 
  { id: 3, name: "Motorbike", price: 2, image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=500", chance: 0.01 }, // 1% chance
  { id: 4, name: "Smart Refrigerator", price: 1, image: "https://images.unsplash.com/photo-1571175432290-ef71a58da9bc?w=500", chance: 0.05 }, // 5% chance
  { id: 5, name: "Washing Machine", price: 3, image: "https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?w=500", chance: 0.05 },
];

export const getLotteryItems = async (req, res) => {
  res.status(200).json({ success: true, items: LOTTERY_ITEMS });
};

export const playLottery = async (req, res) => {
  try {
    const { prizeId } = req.body;
    const user = await User.findById(req.userId);

    const prize = LOTTERY_ITEMS.find(p => p.id === prizeId);
    if (!prize) return res.status(404).json({ message: "Prize not found" });

    if (user.codaBalance < prize.price) {
      return res.status(400).json({ message: "Not enough CODA Coins!" });
    }

    // Deduct entry fee
    user.codaBalance -= prize.price;
    
    // Logic: Generate a random number between 0 and 1
    const result = Math.random();
    const isWinner = result < prize.chance;

    await user.save();

    if (isWinner) {
      res.status(200).json({
        success: true,
        isWinner: true,
        message: `OMG! YOU WON A ${prize.name.toUpperCase()}!!`,
        newBalance: user.codaBalance
      });
    } else {
      res.status(200).json({
        success: true,
        isWinner: false,
        message: `Not this time! But Coca-Cola loves your effort. Try again!`,
        newBalance: user.codaBalance
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Lottery system error" });
  }
};