const { Router } = require("express");
const router = Router();
const { validationResult, body } = require("express-validator");
const multer = require("multer");
const Product = require("../models/Product");
const { default: mongoose } = require("mongoose");

// Configure multer for single file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post(
  "/addproduct",
  upload.single("image"), // Handle single file upload
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
    body("price", "Please enter a valid price").isNumeric().notEmpty(),
  ],
  async (req, res) => {
    try {
      const { category_id, name, description, price, status } = req.body;
      const image = req.file ? req.file.filename : null; // Get the image filename from Multer

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = new Product({
        category_id,
        name,
        description,
        price,
        status,
        image, // Add image to the product data
      });

      const savedProduct = await product.save();
      res.json(savedProduct);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/fetchallproduct", async (req, res) => {
  try {
    const products = await Product.find().populate("category_id", "name");
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Not found");
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.put("/updateproduct/:id", upload.single("image"), async (req, res) => {
  const { category_id, name, description, price, status } = req.body;
  const image = req.file ? req.file.filename : null; // Get the uploaded image filename
  try {
    const newProduct = {};
    if (category_id) {
      newProduct.category_id = category_id;
    }
    if (name) {
      newProduct.name = name;
    }
    if (description) {
      newProduct.description = description;
    }
    if (price) {
      newProduct.price = price;
    }
    if (status) {
      newProduct.status = status;
    }
    if (image) {
      newProduct.image = image; // Add new image filename if provided
    }

    let prod = await Product.findById(req.params.id);
    if (!prod) {
      return res.status(404).send("Product not found");
    }

    prod = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: newProduct },
      { new: true }
    );

    res.json(prod);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getproductbyid/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID");
    }

    const product = await Product.findById(productId).populate(
      "category_id",
      "name"
    );

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/related/:category_id", async (req, res) => {
  try {
    const category_id = req.params.category_id;

    // Ensure the category_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      return res.status(400).send("Invalid category ID");
    }

    console.log("Category ID:", category_id);

    // Fetch products based on the category_id
    const products = await Product.find({ category_id: category_id }).populate(
      "category_id",
      "name"
    );

    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
