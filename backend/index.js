const express = require("express");
const cors = require("cors");
const path = require('path');
const connectToMongo = require("./db");

connectToMongo();

const app = express();
const port = 5000;

app.use(express.json()); // Middleware to parse JSON body
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth/", require("./routes/auth"));
app.use("/api/category/", require("./routes/category"));
app.use("/api/products/", require("./routes/products"));
app.use("/api/customer/", require("./routes/customer"));
app.use("/api/checkout/", require("./routes/checkout"));
app.use("/api/order/", require("./routes/order"));
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
