const mongoose = require("mongoose");
const { Schema } = mongoose;
const SubCategorySchema = new Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
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
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
SubCategory.createIndexes();
module.exports = SubCategory;
