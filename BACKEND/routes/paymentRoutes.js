const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getPaymentPage,
  processPayment,
  getPaymentStatus,
} = require("../controllers/paymentController");

router.get("/", getPaymentPage);
router.post("/pay", authMiddleware, processPayment);
router.get("/payment-status/:orderId", authMiddleware, getPaymentStatus);

module.exports = router;