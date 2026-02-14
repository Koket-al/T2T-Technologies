import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import QRCode from "qrcode";
import dotenv from "dotenv";
import crypto from "crypto";
import QrCodeModel from "./backend/models/QrCode.js"; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const NUM_BOTTLES = 10; // This will generate 10 Caps and 10 Body codes (20 total)
const FOLDER_NAME = "codes-to-print"; 

if (!fs.existsSync(FOLDER_NAME)) fs.mkdirSync(FOLDER_NAME);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    generateCodes();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

const generateSecureShortCode = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  const randomValues = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
};

const generateCodes = async () => {
  try {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    // Official Safety Data for the x402 Oracle
    const safetyData = {
        batchNumber: "T2T-ETH-2026-B1",
        mfgDate: "2026-02-10",
        expDate: "2027-02-10",
        ingredients: "Carbonated Water, Sugar, Caramel Color, Phosphoric Acid, Natural Flavors, Caffeine.",
        isConformityApproved: true
    };

    for (let i = 1; i <= NUM_BOTTLES; i++) {
      // 1️⃣ GENERATE THE CAP CODE (Loyalty & Safety)
      const capHash = generateSecureShortCode();
      const capFileName = `bottle-${i}-CAP.png`;
      await QRCode.toFile(path.join(FOLDER_NAME, capFileName), capHash);

      const capDoc = new QrCodeModel({
        hash: capHash,
        codeType: "CAP", // ✅ FIXED: Required field added
        rewardPoints: 100,
        birrReward: 5,
        isActive: true,
        expiresAt: expirationDate,
        ...safetyData
      });
      await capDoc.save();

      // 2️⃣ GENERATE THE BODY CODE (AI Recycling)
      const bodyHash = generateSecureShortCode();
      const bodyFileName = `bottle-${i}-BODY.png`;
      await QRCode.toFile(path.join(FOLDER_NAME, bodyFileName), bodyHash);

      const bodyDoc = new QrCodeModel({
        hash: bodyHash,
        codeType: "BODY", // ✅ FIXED: Required field added
        rewardPoints: 20, // Body recycling gives more points
        birrReward: 10,  // Body recycling gives more Birr
        isActive: true,
        expiresAt: expirationDate,
        ...safetyData
      });
      await bodyDoc.save();

      console.log(`✅ Provisioned Bottle #${i}: [Cap: ${capHash}] [Body: ${bodyHash}]`);
    }

    console.log(`\n🎉 Success! All secure codes are in /${FOLDER_NAME}`);
    console.log(`Each bottle now has a verified Digital Passport for the x402 Oracle.`);
  } catch (err) {
    console.error("❌ Generation Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};