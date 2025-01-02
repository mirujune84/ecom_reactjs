const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartItemSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  name: String,
  price: Number,
  qty: Number,
  image: String,
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  orderId: String,
  checkouted: { type: String, default: "0" },
});
const CartItem = mongoose.model("CartItem", cartItemSchema);
CartItem.createIndexes();
module.exports = CartItem;
