const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getSuggestedCategory } = require("../controllers/aiCategoryController");

router.post("/suggest", authMiddleware, getSuggestedCategory);

module.exports = router;
