const axios = require("axios");
const express = require("express");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { env } = require("process");
const { validationResult } = require("express-validator");
const Transaction = require("../models/Transactions");
const { default: mongoose } = require("mongoose");
const router = express.Router();

dotenv.config();
const razorpay = new Razorpay({
  key_id: "rzp_test_lT41rfpopumvCV",
  key_secret: "ZkITHvjIqtJnq0lN5VE9itIX",
});
router.post("/create-order", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
// router.post("/verify", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;
//   const crypto = require("crypto");

//   // Log the incoming request data
//   console.log("Received data:", {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//   });

//   const shasum = crypto.createHmac("sha256", "ZkITHvjIqtJnq0lN5VE9itIX");
//   shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//   const digest = shasum.digest("hex");

//   // Log the computed digest and received signature
//   console.log("Computed digest:", digest);
//   console.log("Received signature:", razorpay_signature);

//   if (digest === razorpay_signature) {
//     // Payment is verified
//     res.json({ status: "success", message: "Payment verified successfully" });
//   } else {
//     // Payment verification failed
//     res
//       .status(400)
//       .json({ status: "failure", message: "Payment verification failed" });
//   }
// });
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const shasum = crypto.createHmac("sha256", "ZkITHvjIqtJnq0lN5VE9itIX");
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === razorpay_signature) {
    try {
      // Make a request to Razorpay API to get payment details
      const response = await axios.get(
        `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
        {
          auth: {
            username: "rzp_test_lT41rfpopumvCV",
            password: "ZkITHvjIqtJnq0lN5VE9itIX",
          },
        }
      );

      // Payment is verified and details fetched from Razorpay
      res.json({
        status: "success",
        message: "Payment verified successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Error fetching payment details from Razorpay:", error);

      res.status(500).json({
        status: "error",
        message: "Failed to fetch payment details from Razorpay",
      });
    }
  } else {
    // Payment verification failed
    res.status(400).json({
      status: "failure",
      message: "Payment verification failed",
    });
  }
});
router.post("/capture", async (req, res) => {
  const { payment_id, amount, currency } = req.body;

  try {
    const captureResponse = await razorpay.payments.capture(
      payment_id,
      amount,
      currency
    );
    res.json({
      success: true,
      message: "Payment captured successfully",
      data: captureResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to capture payment",
      error: error.message,
    });
  }
});

router.post("/singleorder", async (req, res) => {
  //   const { orderId } = req.body;
  try {
    const captureResponse = await razorpay.payments.all();
    res.json({
      success: true,
      message: "Payment list",
      data: captureResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get payment",
      error: error.message,
    });
  }
});
router.get("/alltransaction", async (req, res) => {
  const transaction = await Transaction.find();
  res.json(transaction);
});
router.post("/addtransaction", async (req, res) => {
  try {
    const { payment_id, order_id, email, transaction_amount, status } =
      req.body;

    const transaction = new Transaction({
      payment_id,
      order_id,
      email,
      transaction_amount,
      status,
    });
    const savedTransaction = await transaction.save();

    res.json(savedTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const payments = await razorpay.payments.all();

    const successfulPayments = payments.items.filter(
      (payment) => payment.status === "captured"
    );
    const failedPayments = payments.items.filter(
      (payment) => payment.status === "failed"
    );

    res.json({ successfulPayments, failedPayments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transactions" });
  }
});

router.get("/getorderstatus/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Ensure the ID is a valid ObjectId (if you are using MongoDB for storing orders)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send("Invalid order ID");
    }

    // Make a request to Razorpay API to get the order details
    const response = await razorpay.orders.fetch(orderId);

    // Filter payments based on status
    const successfulPayments = response.data.items.filter(
      (payment) => payment.status === "captured"
    );
    const failedPayments = response.data.items.filter(
      (payment) => payment.status === "failed"
    );

    // Return the filtered payments
    res.json({ successfulPayments, failedPayments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transactions" });
  }
});
router.post("/orderlist", async (req, res) => {
  const { orderId } = req.body;
  try {
    const captureResponse = await razorpay.orders.fetch(orderId);
    res.json({
      success: true,
      message: "Order list",
      data: captureResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
});

router.get("/orderpayments/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const captureResponse = await razorpay.orders.fetchPayments(orderId);
    res.json({
      success: true,
      message: "Order Payments",
      data: captureResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
});
module.exports = router;
