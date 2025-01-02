const mongoose = require("mongoose");
const { Schema } = mongoose;
const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Customer = mongoose.model("Customer", CustomerSchema);
Customer.createIndexes();
module.exports = Customer;
