const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {addExpense,getExpenses,deleteExpenses,getCategories,getExpenseReport} = require("../controllers/expenseController");

router.post("/add", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/categories", authMiddleware, getCategories);
router.get("/report", authMiddleware, getExpenseReport);
router.delete("/:id", authMiddleware, deleteExpenses);

module.exports = router;
