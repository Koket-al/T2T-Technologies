import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import scanRoutes from "./routes/scan.routes.js"; // ✅ This is the main rewards file
import marketplaceRoutes from "./routes/marketplace.routes.js";
import lotteryRoutes from "./routes/lottery.routes.js";
import creditRoutes from "./routes/credit.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: "Rate limit exceeded",
});
app.use(limiter);

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", process.env.FRONTEND_URL];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x402-payment-id"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// --- 🚀 ROUTES FIX ---
app.use("/api/auth", authRoutes);
app.use("/api/rewards", scanRoutes); // ✅ Point both rewards and scans to this file
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/lottery", lotteryRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.json({ status: "T2T Bitcoin Node Online" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")));
}

connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 T2T Server active on port ${PORT}`));
}).catch((err) => console.error("DB connection failed:", err));