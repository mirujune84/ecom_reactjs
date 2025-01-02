const jwt = require("jsonwebtoken");
const JWT_SECRET_STRING = "secretstring@123";
const fetchcustomer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(404).send({ error: "token not matched" });
  }
  try {
    const stringjwt = jwt.verify(token, JWT_SECRET_STRING);
    req.customer = stringjwt.customer;
    next();
  } catch (error) {
    res.status(404).send({ error: "token not matched" });
  }
};
module.exports = fetchcustomer;
