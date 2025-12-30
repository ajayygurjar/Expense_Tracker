const express = require("express");
const router = express.Router();
const { addExpense, getExpenses } = require('../controllers/expenseController');

router.post("/add", addExpense);
router.get("/", getExpenses);

module.exports = router;