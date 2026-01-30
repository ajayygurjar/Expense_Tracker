const { Expense, User } = require("../models");
const sequelize = require("../config/database");
const { logError } = require("../utils/logger");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, note } = req.body;
    let category = req.body.category;

    if (!amount || !description) {
      await t.rollback();
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!category || category.trim() === "") {
      category = "others";
    }
    category = (category || "others").trim().toLowerCase();

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        note,
        userId: req.user.userId,
      },
      {
        transaction: t,
      }
    );
    const user = await User.findByPk(req.user.userId, { transaction: t });

    if (user) {
      const newTotalCost = parseFloat(user.totalCost) + parseFloat(amount);
      await user.update({ totalCost: newTotalCost }, { transaction: t });
    }
    await t.commit();

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    logError(error, req, res);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    // Parse and validate pagination parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 10, 1), 100); // Changed from 5 to 1
    const offset = (page - 1) * pageSize;

    // Get total count for this user
    const totalCount = await Expense.count({
      where: { userId: req.user.userId },
    });

    // Fetch paginated expenses
    const expenses = await Expense.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize) || 1; // Ensure at least 1

    res.status(200).json({
      expenses,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error(error);
    logError(error, req, res);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpenses = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({
      where: { id, userId: req.user.userId },
      transaction: t,
    });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }
    const expenseAmount = parseFloat(expense.amount);

    await expense.destroy({ transaction: t });
    const user = await User.findByPk(req.user.userId, { transaction: t });
    if (user) {
      const newTotalCost = parseFloat(user.totalCost) - expenseAmount;
      await user.update(
        { totalCost: Math.max(0, newTotalCost) },
        { transaction: t }
      );
    }
    await t.commit();
    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error(error);
    logError(error, req, res);
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
    console.error(error);
    logError(error, req, res);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenseReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const monthlySummary = await Expense.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("createdAt")), "year"],
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["year", "month"],
      order: [
        [sequelize.literal("year"), "DESC"],
        [sequelize.literal("month"), "DESC"],
      ],
      raw: true,
    });


    const totalExpense = await Expense.sum("amount", {
      where: { userId },
    });


    const expenses = await Expense.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      monthlySummary,
      totalExpense: totalExpense || 0,
      expenses,
    });
  } catch (error) {
    console.error("Report Error:", error);
    logError(error, req, res);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};
