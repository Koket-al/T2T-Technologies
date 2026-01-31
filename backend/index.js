import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import scanRoutes from "./routes/scan.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import lotteryRoutes from "./routes/lottery.routes.js";
import creditRoutes from "./routes/credit.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -----------------------------
// Security Middlewares
// -----------------------------
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// -----------------------------
// Rate Limiter
// -----------------------------
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, try again later",
});
app.use(limiter);

// -----------------------------
// CORS CONFIG
// -----------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", authRoutes);
// FIX: Changed "/api" to "/api/rewards" to match frontend URL
app.use("/api/rewards", scanRoutes); 

app.get("/", (req, res) => {
  res.json({ status: "Server running", version: "1.0.0" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/lottery", lotteryRoutes);
app.use("/api/credit", creditRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection failed:", err));