const express = require("express");
const router = express.Router();
const { addExpense, getExpenses,deleteExpenses } = require('../controllers/expenseController');

router.post("/add", addExpense);
router.get("/", getExpenses);
router.delete('/:id',deleteExpenses)

module.exports = router;