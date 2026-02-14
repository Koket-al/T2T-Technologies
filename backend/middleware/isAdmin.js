import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "ACCESS DENIED: You do not have Administrative privileges." 
      });
    }

    next(); // Proceed to the admin controller
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ success: false, message: "Security Layer Error" });
  }
};