const Transaction = require("../models/transactionModel");
const moment = require("moment");

const getAllTransaction = async (req, res) => {
  try {
    const { frequency = 30, userId, type } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Received request with:", req.body);

    const query = {
      userId,
      date: { $gt: moment().subtract(frequency, "days").toDate() },
    };

    if (type && type !== "all") {
      query.type = type;
    }

    const transactions = await Transaction.find(query);

    console.log("Transactions from DB:", transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

const editTransaction = async (req, res) => {
  try {
    console.log("Edit Request Received:", req.body);

    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      req.body,
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    console.log("Updated Transaction:", updatedTransaction);
    res.status(200).json({ message: "Transaction edited successfully!", updatedTransaction });
  } catch (error) {
    console.error("Error editing transaction:", error);
    res.status(500).json({ error: "Error editing transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    console.log("Delete Request Received:", req.body);

    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    console.log("Deleted Transaction:", deletedTransaction);
    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Error deleting transaction" });
  }
};


// ✅ Ensure addTransaction is defined BEFORE exporting
const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding transaction" });
  }
};


// ✅ Correctly export the functions
module.exports = { addTransaction, getAllTransaction, editTransaction, deleteTransaction };
