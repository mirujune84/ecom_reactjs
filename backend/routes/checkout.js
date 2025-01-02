const { Router } = require("express");
const router = Router();
const CartItem = require("../models/Cart");
const Order = require("../models/Order");
const fetchcustomer = require("../middleware/fetchcustomer");

// Add to cart
router.post("/add", fetchcustomer, async (req, res) => {
  const { cartItems, userId } = req.body;

  try {
    const newCartItems = await Promise.all(
      cartItems.map(async (item) => {
        if (cartItems) {
          // If it's a reorder, create a new entry for each item
          const newItem = new CartItem({ ...item, userId });
          await newItem.save();
          return newItem;
        } else {
          // For a new order, update existing item quantities or create new ones
          const existingItem = await CartItem.findOne({
            userId,
            productId: item.productId,
          });

          if (existingItem) {
            existingItem.qty += item.qty;
            await existingItem.save();
            return existingItem;
          } else {
            const newItem = new CartItem({ ...item, userId });
            await newItem.save();
            return newItem;
          }
        }
      })
    );

    res.status(201).send(newCartItems);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update cart item
router.put("cart/update/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCartItem = await CartItem.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.send(updatedCartItem);
});

// Delete cart item
router.delete("cart/delete/:id", fetchcustomer, async (req, res) => {
  const { id } = req.params;
  await CartItem.findByIdAndDelete(id);
  res.send({ message: "Item deleted" });
});

// Get cart items for a user
router.get("cart/:userId", async (req, res) => {
  const { userId } = req.params;
  const cartItems = await CartItem.find({ userId });
  res.send(cartItems);
});

// Create order
router.post("/order", async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  const newOrder = new Order({ userId, items, totalAmount, status: "pending" });
  await newOrder.save();
  res.status(201).send(newOrder);
});

// Get orders for a user
router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId }).populate("items");
  res.send(orders);
});

module.exports = router;
