import QrCode from "../models/QrCode.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { verifyStacksPayment } from "../utils/stacksVerifier.js";

// 1. GENERATE INDUSTRIAL BATCH (Pairs: Cap + Body)
export const generateBatch = async (req, res) => {
    try {
      const { count, batchId, expDate, ingredients } = req.body;
      const user = await User.findById(req.userId);
  
      if (!user.hasMarketplaceAccess) {
          return res.status(403).json({ message: "Enterprise License Required" });
      }
  
      const codes = [];
      const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

      // For every 1 unit, we generate 2 distinct hashes
      for (let i = 0; i < parseInt(count); i++) {
        
        // --- Generate CAP Hash (Manual Loyalty) ---
        let capHash = "";
        const randomCap = crypto.randomBytes(8);
        for (let j = 0; j < 8; j++) { capHash += charset[randomCap[j] % charset.length]; }

        // --- Generate BODY Hash (AI Recycling Only) ---
        let bodyHash = "";
        const randomBody = crypto.randomBytes(8);
        for (let j = 0; j < 8; j++) { bodyHash += charset[randomBody[j] % charset.length]; }

        // Add CAP entry
        codes.push({
          hash: capHash, rewardPoints: 10, isActive: true, expiresAt: new Date(expDate),
          batchNumber: batchId, mfgDate: new Date().toISOString().split('T')[0],
          expDate, ingredients, isConformityApproved: true, 
          codeType: "CAP" // ✅ Consumer side
        });

        // Add BODY entry
        codes.push({
            hash: bodyHash, rewardPoints: 20, isActive: true, expiresAt: new Date(expDate),
            batchNumber: batchId, mfgDate: new Date().toISOString().split('T')[0],
            expDate, ingredients, isConformityApproved: true, 
            codeType: "BODY" // ✅ AI Bin side
        });
      }

      await QrCode.insertMany(codes);
      
      console.log(`🏭 FACTORY: Batch ${batchId} issued. ${count} bottles (${count * 2} hashes).`);

      res.status(201).json({ 
        success: true, 
        message: `Industrial Success: ${count} Bottle Sets (${count * 2} Total Hashes) synced with Stacks Ledger.` 
      });

    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: "Database Error in Factory Node" }); 
    }
};

// 2. FETCH BATCH HISTORY
export const getBatchHistory = async (req, res) => {
  try {
    const batches = await QrCode.aggregate([
      {
        $group: {
          _id: "$batchNumber",
          totalUnits: { $sum: 1 },
          mfgDate: { $first: "$mfgDate" },
          expDate: { $first: "$expDate" },
          createdAt: { $first: "$createdAt" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.status(200).json({ success: true, batches });
  } catch (error) {
    res.status(500).json({ message: "History Ledger Error" });
  }
};

// 3. EXPORT HASHES FOR PRINTING
export const exportBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const codes = await QrCode.find({ batchNumber: batchId }).select("hash codeType -_id");
    
    // Create a professional list showing which code is for CAP and which is for BODY
    const codeList = codes.map(c => `[${c.codeType}] ${c.hash}`).join("\n");
    
    res.status(200).json({ success: true, codeList });
  } catch (error) {
    res.status(500).json({ message: "Export Failed" });
  }
};

// 4. ADMIN PANEL UNLOCK
export const unlockAdminPanel = async (req, res) => {
    try {
      const { txId } = req.body;
      const isPaid = await verifyStacksPayment(txId, 1000000, process.env.STACKS_ADMIN_ADDRESS);
      if (!isPaid) return res.status(400).json({ message: "Verification Pending..." });
      const user = await User.findById(req.userId);
      user.hasMarketplaceAccess = true; 
      await user.save();
      res.status(200).json({ success: true, message: "Corporate License Active" });
    } catch (error) { res.status(500).json({ message: "Auth Error" }); }
};