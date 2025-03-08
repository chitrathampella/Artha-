// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ["income", "expense"] },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, default: "" },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
