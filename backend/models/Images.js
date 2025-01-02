const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
