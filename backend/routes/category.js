const { Router } = require("express");
const router = Router();
const Category = require("../models/Category");
const { validationResult, body } = require("express-validator");
const Product = require("../models/Product");

//CATEGORY START
router.get("/fetchallcategory", async (req, res) => {
  const category = await Category.find();
  res.json(category);
});
router.post(
  "/addcategory",
  [
    body("name", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const { parent_id, name, description, status } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const category = new Category({
        parent_id,
        name,
        description,
        status,
      });
      const savedCategory = await category.save();

      res.json(savedCategory);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//Update Note
router.put("/updatecategory/:id", async (req, res) => {
  const { name, description, status } = req.body;
  try {
    const newCategory = {};
    if (name) {
      newCategory.name = name;
    }
    if (description) {
      newCategory.description = description;
    }
    if (status) {
      newCategory.status = status;
    }
    let cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).send("Not found");
    }
    cat = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: newCategory },
      { new: true }
    );
    res.json(cat);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deletecategory/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Check if there are products associated with this category
    const products = await Product.find({ category_id: categoryId });

    if (products.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with associated products." });
    }

    // Proceed with deletion
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getcategorybyid/:id", async (req, res) => {
  try {
    let cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).send("Not found");
    }
    cat = await Category.findById(req.params.id);
    res.json(cat);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
//CATEGORY END

module.exports = router;
