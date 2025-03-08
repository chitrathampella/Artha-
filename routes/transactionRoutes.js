const express = require("express");
const transactionController = require("../controllers/transactionCtrl");

const router = express.Router();

router.post("/add", transactionController.addTransaction);
router.post("/edit", transactionController.editTransaction);  // Make sure frontend calls "/api/transactions/edit"
router.post("/delete-transaction", transactionController.deleteTransaction);
router.post("/get-transactions", transactionController.getAllTransaction);

module.exports = router;
