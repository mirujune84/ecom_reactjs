import React, { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const userData = getStoredData("user_data");
    if (userData) {
      setUserData(userData);
      fetchOrders(userData._id);
    } else {
      console.log("No user_data found in localStorage.");
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(
        `http://192.168.0.113:3001/api/order/fetchordersbyuserid/${userId}`,
        {
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log("Fetched Orders:", json); // Print fetched data to the console
      setOrders(json);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cart-items">
      <Container>
        <Row>
          <Col>
            <h2>My Orders</h2>
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </div>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Payment Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <Link
                          to={`/orderdetail/${item.orderId}`}
                          style={{ cursor: "pointer" }}
                        >
                          {item.orderId}
                        </Link>
                      </td>
                      <td>{item.name}</td>
                      <td>₹{item.totalAmount}</td>
                      <td>
                        <span
                          className={`p-2 badge ${
                            item.status === "attempted"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MyOrders;
