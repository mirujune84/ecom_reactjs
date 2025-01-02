const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new Schema({
  orderId: String,
  order_unique_id: String,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  name: String,
  email: String,
  mobile: Number,
  address: String,
  totalAmount: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);
Order.createIndexes();
module.exports = Order;
