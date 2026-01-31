import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import QRCode from "qrcode";
import dotenv from "dotenv";
import crypto from "crypto"; // Added for high-level security
import QrCodeModel from "./backend/models/QrCode.js"; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const NUM_CODES = 1000;
const FOLDER_NAME = "codes-to-print"; 

if (!fs.existsSync(FOLDER_NAME)) fs.mkdirSync(FOLDER_NAME);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    generateCodes();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

/**
 * GENERATES A CRYPTOGRAPHICALLY SECURE 8-CHARACTER CODE
 * This uses the 'crypto' module which is unguessable by hackers.
 * We also removed confusing characters like 0, O, 1, and I.
 */
const generateSecureShortCode = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed O, 0, I, 1, L
  let result = "";
  const randomValues = crypto.randomBytes(8); // Get 8 random bytes
  
  for (let i = 0; i < 8; i++) {
    // Pick a character based on the random byte value
    result += charset[randomValues[i] % charset.length];
  }
  return result;
};

const generateCodes = async () => {
  try {
    // Expiration date (3 years from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    for (let i = 1; i <= NUM_CODES; i++) {
      const shortCode = generateSecureShortCode();
      const fileName = `code-${i}.png`;
      const filePath = path.join(FOLDER_NAME, fileName);

      // Generate the QR Image (for the bottle label)
      await QRCode.toFile(filePath, shortCode);

      // Save the secure code to the database
      const newCode = new QrCodeModel({
        hash: shortCode,
        rewardPoints: 1200,
        isActive: true,
        expiresAt: expirationDate,
      });

      await newCode.save();
      console.log(`✅ Generated Secure Code: ${shortCode}`);
    }
    console.log(`\n🎉 Success! All secure codes are in /${FOLDER_NAME}`);
  } catch (err) {
    console.error("❌ Error during generation:", err);
  } finally {
    mongoose.disconnect();
  }
};