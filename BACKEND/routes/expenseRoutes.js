const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addExpense, getExpenses,deleteExpenses } = require('../controllers/expenseController');

router.post("/add",authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.delete('/:id',authMiddleware, deleteExpenses)

module.exports = router;