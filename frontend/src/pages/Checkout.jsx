import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../app/features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  addToCart,
  decreaseQty,
  deleteProduct,
} from "../app/features/cart/cartSlice";
const Checkout = () => {
  const { cartList } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [userData, setUserData] = useState({});
  const [cartData, setCartData] = useState({});
  const [isPaying, setIsPaying] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);

    // Load cart data from localStorage
    const getcartList = cartList;

    if (getcartList) {
      try {
        setCartData(JSON.parse(getcartList));
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }

    // Load user data from localStorage
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
        setFormData({
          ...formData,
          name: JSON.parse(storedUserData).name || "",
          email: JSON.parse(storedUserData).email || "",
          mobile: JSON.parse(storedUserData).mobile || "",
          address: JSON.parse(storedUserData).address || "",
        });
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const totalPrice = cartList.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsPaying(true);
    const { name, email, mobile, address } = formData;

    try {
      // Step 1: Create an order on the server
      const response = await fetch(
        "http://192.168.0.113:3001/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: totalPrice,
            currency: "INR",
            receipt: `receipt#${Date.now()}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const orderResponse = await response.json();

      const { amount, id: order_id, currency } = orderResponse;
      const response1 = await fetch(
        "http://192.168.0.113:3001/api/payment/orderlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            orderId: order_id,
          }),
        }
      );

      if (!response1.ok) {
        throw new Error("Network response was not ok");
      }

      const order = await response1.json();
      console.log("THIS IS ORDER STATUS", order);
      const unique_id = localStorage.getItem("unique_id");
      await fetch("http://192.168.0.113:3001/api/order/addorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          orderId: order_id,
          order_unique_id: unique_id,
          userId: userData._id,
          items: cartList.map((item) => item._id),
          totalAmount: totalPrice,
          name: name,
          email: email,
          mobile: mobile,
          address: address || userData.address || "",
          status: orderResponse.status,
        }),
      });
      // Step 2: Configure Razorpay payment options
      const options = {
        key: "rzp_test_lT41rfpopumvCV",
        amount: amount,
        currency: currency,
        name: "Clever-Shop",
        description: "Order Placed",
        order_id: order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on the server
            const verifyResponse = await fetch(
              "http://192.168.0.113:3001/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const verifyResult = await verifyResponse.json();
            console.log("verifyResult", verifyResult);
            if (verifyResult) {
              // Save transaction and order
              await fetch(
                "http://192.168.0.113:3001/api/payment/addtransaction",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    payment_id: response.razorpay_payment_id,
                    order_id: order_id,
                    email: email,
                    transaction_amount: totalPrice,
                    status: verifyResult.data.status,
                  }),
                }
              );
              // await fetch(
              //   `http://192.168.0.113:3001/api/order/update/${order_id}`,
              //   {
              //     method: "PUT",
              //     headers: {
              //       "Content-Type": "application/json",
              //       "auth-token": localStorage.getItem("token"),
              //     },
              //     body: JSON.stringify({
              //       status: verifyResult.data.status,
              //     }),
              //   }
              // );
              // Clear cart and redirect
              dispatch(clearCart());
              localStorage.removeItem("cartList");
              navigate("/");
            } else {
              console.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error handling payment response:", error);
          } finally {
            setIsPaying(false); // Re-enable button after process completes
          }
        },
        prefill: {
          name: name,
          email: email,
          mobile: mobile || "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false); // Re-enable button if user closes the modal
            console.log("Checkout form closed");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      setIsPaying(false);
    }
  };

  return (
    <section className="cart-items">
      <form onSubmit={handlePayment}>
        <Container>
          <Row className="justify-content-center">
            <Link to={"/cart"} className="text-dark">
              &lt;&lt; Back to cart
            </Link>
            <Col md={8} className="cart-total">
              {!localStorage.getItem("token") && (
                <div
                  className="alert alert-warning d-flex align-items-center"
                  role="alert"
                >
                  <div>
                    <i className="fa-solid fa-triangle-exclamation"></i> Please
                    login first to checkout!!
                  </div>
                </div>
              )}
              {cartList.length === 0 ? (
                <h1 className="no-items product">No Items are added in Cart</h1>
              ) : (
                cartList.map((item) => {
                  const productQty = item.price * item.qty;
                  return (
                    <div className="cart-list" key={item._id}>
                      <Row>
                        <Col className="image-holder" sm={4} md={3}>
                          <img
                            src={`http://192.168.0.113:3001/uploads/${item.image}`}
                            alt=""
                          />
                        </Col>
                        <Col sm={8} md={9}>
                          <Row className="cart-content justify-content-center">
                            <Col xs={12} sm={9} className="cart-details">
                              <h3>{item.name}</h3>
                              <h4>
                                ${item.price}.00 * {item.qty}
                                <span>${productQty}.00</span>
                              </h4>
                            </Col>
                            <Col xs={12} sm={3} className="cartControl"></Col>
                          </Row>
                        </Col>
                        <Col
                          xs={12}
                          className="d-flex justify-content-end"
                        ></Col>
                      </Row>
                    </div>
                  );
                })
              )}
              <h2>Billing Address</h2>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  Mobile
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="cart-total">
                <h2>Checkout</h2>
                <div className="d_flex">
                  <h4>Total Price :</h4>
                  <h3>${totalPrice}.00</h3>
                  <div>
                    {localStorage.getItem("token") && (
                      <div>
                        <p>Address:</p>
                        <p>{formData.address || userData.address}</p>
                        <p>{userData.pincode}</p>
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={isPaying || !localStorage.getItem("token")} // Disable button when isPaying is true
                        >
                          {isPaying ? "Processing..." : "Pay Now"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </form>
    </section>
  );
};

export default Checkout;
