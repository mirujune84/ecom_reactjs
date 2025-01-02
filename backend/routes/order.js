const { Router } = require("express");
const router = Router();
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { default: mongoose } = require("mongoose");
const CartItem = require("../models/Cart");
const Product = require("../models/Product");
const fetchcustomer = require("../middleware/fetchcustomer");
const Transaction = require("../models/Transactions");

dotenv.config();
const razorpay = new Razorpay({
  key_id: "rzp_test_lT41rfpopumvCV",
  key_secret: "ZkITHvjIqtJnq0lN5VE9itIX",
});
// Create order
router.post("/addorder", fetchcustomer, async (req, res) => {
  const {
    orderId,
    order_unique_id,
    userId,
    items,
    totalAmount,
    name,
    email,
    mobile,
    address,
    status,
  } = req.body;

  console.log("Received order data:", req.body);

  const newOrder = new Order({
    orderId,
    order_unique_id,
    userId,
    items,
    totalAmount,
    name,
    email,
    mobile,
    address,
    status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("New order saved:", savedOrder);
    res.status(201).send(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send({ error: "Failed to save order" });
  }
});

// Get orders for a user
router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId }).populate("items");
  res.send(orders);
});
router.get("/fetchallorders", async (req, res) => {
  try {
    // Fetch all orders from the database, sorted by updatedAt field in descending order
    const orders = await Order.find().sort({ updatedAt: -1 });

    // Iterate over each order and fetch its status from Razorpay
    for (let order of orders) {
      const orderId = order.orderId; // Adjust this to match your order schema

      try {
        // Fetch order details from Razorpay
        const captureResponse = await razorpay.orders.fetch(orderId);

        // Get the status from the Razorpay response
        const razorpayStatus = captureResponse.status;

        // Update the order status in your database
        order.status = razorpayStatus;
        await order.save();
      } catch (error) {
        console.error(
          `Failed to fetch/update status for order ${orderId}:`,
          error
        );
      }
    }

    // Send updated orders as the response
    const updatedOrders = await Order.find().sort({ updatedAt: -1 });
    res.json(updatedOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/getorderbyid/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Fetch the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Extract order_unique_id
    const { order_unique_id } = order;

    // Fetch all cart items for the given order_unique_id
    const cartItems = await CartItem.find({ orderId: order_unique_id });

    // Fetch product information for each cart item
    const productIds = cartItems.map((item) => item.productId); // Assuming cart items have a productId field
    const products = await Product.find({ _id: { $in: productIds } }).populate(
      "category_id"
    ); // Adjust the field name if necessary

    // Combine cart items with product information
    const cartItemsWithProducts = cartItems.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId));
      return { ...item._doc, product };
    });

    // Fetch payment_id from Transaction table
    const transaction = await Transaction.findOne({ order_id: orderId });
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }
    const { payment_id } = transaction;

    // Send the response
    res.json({
      order,
      cartItems: cartItemsWithProducts,
      payment_id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getorderbyuserid/:userId", fetchcustomer, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch orders for the given user ID
    const orders = await Order.find({ userId });
    if (!orders || orders.length === 0) {
      return res.status(404).send("Orders not found");
    }

    // Extract order_unique_ids
    const orderUniqueIds = orders.map((order) => order.order_unique_id);

    // Fetch all cart items for the given order_unique_ids
    const cartItems = await CartItem.find({ orderId: { $in: orderUniqueIds } });

    // Fetch product information for each cart item
    const productIds = cartItems.map((item) => item.productId); // Assuming cart items have a productId field
    const products = await Product.find({ _id: { $in: productIds } }).populate(
      "category_id"
    ); // Adjust the field name if necessary

    // Combine cart items with product information
    const cartItemsWithProducts = cartItems.map((item) => {
      const product = products.find((p) => p._id.equals(item.productId));
      return { ...item._doc, product };
    });

    // Send the response
    res.json({
      orders,
      cartItems: cartItemsWithProducts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Check if orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send("Invalid order ID");
    }

    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );
    console.log(order);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/fetchordersbyuserid/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch all orders for the specified user, sorted by updatedAt field in descending order
    const orders = await Order.find({ userId }).sort({ updatedAt: -1 });

    // Iterate over each order and fetch its status from Razorpay
    for (let order of orders) {
      const orderId = order.orderId; // Adjust this to match your order schema

      try {
        // Fetch order details from Razorpay
        const captureResponse = await razorpay.orders.fetch(orderId);

        // Get the status from the Razorpay response
        const razorpayStatus = captureResponse.status;

        // Update the order status in your database
        order.status = razorpayStatus;
        await order.save();
      } catch (error) {
        console.error(
          `Failed to fetch/update status for order ${orderId}:`,
          error
        );
      }
    }

    // Send updated orders as the response
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
