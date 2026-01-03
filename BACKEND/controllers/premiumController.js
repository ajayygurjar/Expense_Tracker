const { User, Expense } = require("../models");
const { Sequelize } = require("sequelize");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "isPremium",'totalCost'],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        totalCost:user.totalCost,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentUser = await User.findByPk(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.isPremium) {
      return res.status(403).json({
        message:
          "Access denied. This feature is only available for premium members.",
      });
    }

    const leaderboard = await User.findAll({
      attributes: ["id", "name", "totalCost"],

      order:[["totalCost", "DESC"]],

      limit: 100,
    });

    const formattedLeaderboard = leaderboard.map((user) => ({
      id: user.id,
      name: user.name,
      total_cost: parseFloat(user.totalCost) || 0,
    }));

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
