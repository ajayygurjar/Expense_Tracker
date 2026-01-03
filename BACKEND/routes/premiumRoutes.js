const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile,getLeaderboard } = require("../controllers/premiumController");

router.get("/profile", authMiddleware, getUserProfile);
router.get("/leaderboard", authMiddleware, getLeaderboard);
module.exports = router;