const mongoose = require("mongoose");
const { Schema } = mongoose;
const TransactionSchema = new Schema({
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  transaction_amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Transaction = mongoose.model("Transaction", TransactionSchema);
Transaction.createIndexes();
module.exports = Transaction;
