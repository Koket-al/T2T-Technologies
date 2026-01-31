import { User } from "../models/user.model.js";

// Professional Image Links for Coca-Cola Products
const SHOP_ITEMS = [
  { 
    id: 1, 
    name: "Classic Coke (350ml)", 
    price: 1, 
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "Coke Zero (500ml)", 
    price: 2, 
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=500&auto=format&fit=crop" 
  },
 
  { 
    id: 4, 
    name: "Coke Red T-Shirt", 
    price: 15, 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop" 
  },
];

export const getItems = async (req, res) => {
  res.status(200).json({ success: true, items: SHOP_ITEMS });
};

export const purchaseItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Check if user has enough CODA coins
    if (user.codaBalance < item.price) {
      return res.status(400).json({ message: "You don't have enough CODA Coins for this!" });
    }

    // Process Purchase: Deduct from the user's digital balance
    user.codaBalance -= item.price;
    await user.save();

    console.log(`✅ Purchase Success: ${user.email} bought ${item.name}`);

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${item.name}! Check your email for pickup instructions.`,
      newBalance: user.codaBalance
    });
  } catch (error) {
    console.error("Purchase Error:", error);
    res.status(500).json({ message: "Server error during purchase" });
  }
};