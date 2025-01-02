const { Router } = require("express");
const Admin = require("../models/Admin"); // Ensure the correct path
const { check, validationResult } = require("express-validator");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchadmin = require("../middleware/fetchadmin");
const JWT_SECRET_STRING = "secretstring@123";

router.post(
  "/createuser",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("email", "Email is already in use").custom(async (value) => {
      const admin = await Admin.findOne({ email: value });
      if (admin) {
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
      // Create a new admin
      const admin = new Admin({
        name: req.body.name, // name send
        email: req.body.email, //email send
        password: hashedpassword, //hash paaword generate
      });
      await admin.save(); //save data to mongo DB
      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET_STRING); //genrate auth jwt token
      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        authToken,
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
      let admin = await Admin.findOne({ email });
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, error: "Login with correct creds" });
      }
      const passcompare = await bcrypt.compare(password, admin.password);
      if (!passcompare) {
        return res
          .status(404)
          .json({ success: false, error: "Login with correct creds" });
      }
      const payloadData = {
        admin: {
          id: admin.id,
        },
      };

      const authToken = jwt.sign(payloadData, JWT_SECRET_STRING); //genrate auth jwt token
      res.status(201).json({
        success: true,
        message: "Admin Loged in successfully",
        authToken,
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
router.put("/getuser", fetchadmin, async (req, res) => {
  try {
    const userId = req.admin.id;
    const admin = await Admin.findById(userId).select("-password");
    res.send(admin);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
