const { Expense, User } = require("../models");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;
    let category = req.body.category;

    if (!amount || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!category || category.trim() === "") {
      category = "others";
    }
    category = (category || "others").trim().toLowerCase();

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
    const user = await User.findByPk(req.user.userId);
    if (user) {
      const newTotalCost = parseFloat(user.totalCost) - expenseAmount;
      await user.update({ totalCost: Math.max(0, newTotalCost) });
    }
    return res.status(200).json({ message: "expense deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.userId },
      attributes: ["category"],
      group: ["category"],
    });

    res.status(200).json({
      categories: expenses.map((e) => e.category),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
