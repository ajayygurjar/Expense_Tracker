const { Expense, User } = require("../models");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.userId,
    });
    const user = await User.findByPk(req.user.userId);

    if (user) {
      const newTotalCost = parseFloat(user.totalCost) + parseFloat(amount);
      await user.update({ totalCost: newTotalCost });
    }

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ expenses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({
      where: { id, userId: req.user.userId },
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const expenseAmount = parseFloat(expense.amount);

    await expense.destroy();
    const user=await User.findByPk(req.user.userId);
    if(user){
      const newTotalCost=parseFloat(user.totalCost)-expenseAmount;
      await user.update({ totalCost: Math.max(0, newTotalCost) });;
    }
    return res.status(200).json({ message: "expense deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
