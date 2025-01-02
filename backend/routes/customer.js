const { Router } = require("express");
const Customer = require("../models/Customer"); // Ensure the correct path
const { check, validationResult } = require("express-validator");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchcustomer = require("../middleware/fetchcustomer");
const JWT_SECRET_STRING = "secretstring@123";

router.post(
  "/createcustomer",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("email", "Email is already in use").custom(async (value) => {
      const customer = await Customer.findOne({ email: value });
      if (customer) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const JWT_SECRET_STRING = "secretstring@123"; // Jwt password token secret string
    try {
      const salt = await bcrypt.genSalt(10); // create solt password string
      const hashedpassword = await bcrypt.hash(req.body.password, salt); // proccess hashed password
      // Create a new customer
      const customer = new Customer({
        name: req.body.name, // name send
        email: req.body.email, //email send
        password: hashedpassword, //hash paaword generate
      });
      await customer.save(); //save data to mongo DB
      const data = {
        customer: {
          id: customer.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET_STRING); //genrate auth jwt token
      res.status(201).json({
        success: true,
        message: "User created successfully",
        authToken,
        customer,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: errors });
    }
  }
);
//Login API
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let customer = await Customer.findOne({ email });
      if (!customer) {
        return res
          .status(404)
          .json({ success: false, error: "Login with correct creds" });
      }
      const passcompare = await bcrypt.compare(password, customer.password);
      if (!passcompare) {
        return res
          .status(404)
          .json({ success: false, error: "Login with correct creds" });
      }
      const payloadData = {
        customer: {
          id: customer.id,
        },
      };

      const authToken = jwt.sign(payloadData, JWT_SECRET_STRING); //genrate auth jwt token
      res.status(201).json({
        success: true,
        message: "User Loged in successfully",
        authToken,
        customer,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: errors });
    }
  }
);
//Fetch users
router.put("/getcustomer", fetchcustomer, async (req, res) => {
  try {
    const userId = req.customer.id;
    const customer = await Customer.findById(userId).select("-password");
    res.send(customer);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getallcustomers", async (req, res) => {
  const customer = await Customer.find();
  res.json(customer);
});

router.delete("/deletecustomer/:id", async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send("Not found");
    }
    customer = await Customer.findByIdAndDelete(req.params.id);
    res.json(customer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/updatecustomer/:id", fetchcustomer, async (req, res) => {
  const { name, email, address, pincode } = req.body;
  try {
    const newCustomer = {};
    if (name) {
      newCustomer.name = name; // Correct field name
    }
    if (email) {
      newCustomer.email = email; // Correct field name
    }
    if (address) {
      newCustomer.address = address; // Correct field name
    }
    if (pincode) {
      newCustomer.pincode = pincode; // Correct field name
    }

    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }

  
    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: newCustomer },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
