const { Cashfree, CFEnvironment } = require("cashfree-pg");
const { Order, User } = require("../models/index.js");
const sequelize = require("../config/database");

// Logger
const { logError } = require("../utils/logger");


// Helper: Get Cashfree Environment

const getEnvironment = () => {
  const env = process.env.CASHFREE_ENVIRONMENT || "SANDBOX";
  return env === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;
};


// Initialize Cashfree

const cashfree = new Cashfree(
  getEnvironment(),
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);


// CREATE ORDER (Cashfree)

const createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerId,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    const returnUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/payment-status/${orderId}`;

    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: orderCurrency,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url:
          "https://www.cashfree.com/devstudio/preview/pg/webhooks/10094570",
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: expiryDate.toISOString(),
    };

    const response = await cashfree.PGCreateOrder(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error;
  }
};


// PAYMENT PAGE (Frontend handles UI)

exports.getPaymentPage = (req, res) => {
  res.json({
    message: "Payment page handled on frontend",
  });
};

// PROCESS PAYMENT

exports.processPayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.userId;

    console.log("Processing payment for userId:", userId);

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = userId.toString();
    const customerPhone = "9999999999";

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    const order = await Order.create(
      {
        orderId,
        paymentSessionId,
        orderAmount,
        orderCurrency,
        paymentStatus: "PENDING",
        userId,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      orderId,
      paymentSessionId,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error processing payment:", error);
    logError(error, req, res);

    res.status(500).json({
      message: "Payment processing failed",
      error: error.message,
    });
  }
};

// GET PAYMENT STATUS
exports.getPaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const t = await sequelize.transaction();

  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const transactions = response.data;

    let paymentStatus = "PENDING";

    if (transactions.some((txn) => txn.payment_status === "SUCCESS")) {
      paymentStatus = "SUCCESS";
    } else if (transactions.some((txn) => txn.payment_status === "FAILED")) {
      paymentStatus = "FAILED";
    }

    await Order.update(
      { paymentStatus },
      { where: { orderId }, transaction: t }
    );

    if (paymentStatus === "SUCCESS") {
      const order = await Order.findOne({
        where: { orderId },
        transaction: t,
      });

      if (order) {
        await User.update(
          { isPremium: true },
          { where: { id: order.userId }, transaction: t }
        );
      }
    }

    await t.commit();

    res.status(200).json({
      orderId,
      paymentStatus,
      transactions,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error fetching payment status:", error);
    logError(error, req, res);

    res.status(500).json({
      message: "Unable to fetch payment status",
    });
  }
};
