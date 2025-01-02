import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQty,
  deleteProduct,
} from "../app/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Cart = () => {
  const cartList = useSelector((state) => state.cart.cartList) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const getStoredData = (key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (error) {
          console.error(
            `Error parsing JSON from localStorage key "${key}":`,
            error
          );
          localStorage.removeItem(key);
        }
      }
      return null;
    };

    const cartData = getStoredData("cartList");
    if (!cartData) {
      console.log("No cartList found in localStorage.");
    }

    const userData = getStoredData("user_data");
    if (userData) {
      setUserData(userData);
    } else {
      console.log("No user_data found in localStorage.");
    }
  }, []);

  const totalPrice = cartList.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if (cartList.length === 0) {
      console.log("No items in cart to checkout.");
      return;
    }
    try {
      const orderId = uuidv4();
      localStorage.setItem("unique_id", orderId);
      const cartItems = cartList.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        orderId: orderId,
      }));

      const response = await fetch("http://192.168.0.113:3001/api/checkout/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          cartItems: cartItems,
          userId: userData._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const orderResponse = await response.json();
      console.log(orderResponse);

      navigate("/checkout");
    } catch (error) {
      console.error("There was an error processing the checkout!", error);
    }
  };

  return (
    <section className="cart-items">
      <form onSubmit={handleClick}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
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
                                ₹{item.price}.00 * {item.qty}
                                <span>₹{productQty}.00</span>
                              </h4>
                            </Col>
                            <Col xs={12} sm={3} className="cartControl">
                              <button
                                type="button"
                                className="incCart"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  dispatch(
                                    addToCart({ product: item, num: 1 })
                                  );
                                }}
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                              <button
                                type="button"
                                className="desCart"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  dispatch(decreaseQty(item));
                                }}
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              dispatch(deleteProduct(item));
                            }}
                          >
                            <ion-icon name="close"></ion-icon>
                          </button>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              )}
            </Col>
            <Col md={4}>
              <div className="cart-total">
                <h2>Cart Summary</h2>
                <div className=" d_flex">
                  <h4>Total Price :</h4>
                  <h3>₹{totalPrice}.00</h3>
                  <div>
                    {localStorage.getItem("token") && (
                      <div>
                        <p>Shipping Method: DTDC</p>
                        {cartList.length > 0 && (
                          <button type="submit" className="btn btn-primary">
                            Check Out
                          </button>
                        )}
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

export default Cart;
