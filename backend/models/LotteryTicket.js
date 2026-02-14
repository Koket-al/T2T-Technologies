import mongoose from "mongoose";

const lotteryTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prizeName: { type: String, required: true },
  ticketNumber: { type: String, required: true },
  status: { type: String, default: "Active" }, // Active, Winner, or Better Luck Next Time
  purchaseDate: { type: Date, default: Date.now }
});

const LotteryTicket = mongoose.model("LotteryTicket", lotteryTicketSchema);
export default LotteryTicket;