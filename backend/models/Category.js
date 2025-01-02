const mongoose = require("mongoose");
const { Schema } = mongoose;
const CategorySchema = new Schema({
  parent_id:{
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const Category = mongoose.model("Category", CategorySchema);
Category.createIndexes();
module.exports = Category;
