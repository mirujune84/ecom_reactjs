import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Banner from "../components/Banner/Banner";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the order ID from the URL

  const [order, setOrder] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentId, setPaymentId] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.113:3001/api/order/getorderbyid/${id}`
        );
        const { order, cartItems, payment_id } = response.data;
        setOrder(order);
        setCartItems(cartItems);
        setPaymentId(payment_id);
      } catch (error) {
        console.error("Error fetching order details:", error);
        // Handle error, e.g., show a message to the user
      }
    };

    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.113:3001/api/payment/orderpayments/${id}`
        );
        setTransactionHistory(response.data.data.items);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        // Handle error, e.g., show a message to the user
      }
    };

    const fetchData = async () => {
      await fetchOrderDetails();
      await fetchTransactionHistory();
      setLoading(false); // Set loading to false after both API calls
    };

    fetchData();
  }, [id]);

  return (
    <Fragment>
      <Banner title="Order Detail" />
      <section className="container filter-bar">
        <Card>
          <CardBody>
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
            ) : (
              <>
                <CardTitle tag="h5">Order Detail</CardTitle>
                <Row className="justify-content-center mt-3">
                  <Col md={6}>
                    <CardText>
                      <strong>Order ID:</strong> {order.orderId}
                    </CardText>
                    <CardText>
                      <strong>Payment Id:</strong> {paymentId}
                    </CardText>
                    <CardText>
                      <strong>User Name:</strong> {order.name}
                    </CardText>
                    <CardText>
                      <strong>Email:</strong> {order.email}
                    </CardText>
                    <CardText>
                      <strong>Mobile:</strong> {order.mobile}
                    </CardText>
                  </Col>
                  <Col md={6}>
                    <CardText>
                      <strong>Address:</strong> {order.address}
                    </CardText>
                    <CardText>
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </CardText>
                    <CardText>
                      <strong>Payment Status:</strong>{" "}
                      {
                        transactionHistory.find(
                          (transaction) => transaction.id === paymentId
                        )?.status
                      }
                    </CardText>
                    <CardText>
                      <strong>Order Status:</strong> {order.status}
                    </CardText>
                    <CardText>
                      <strong>Created At:</strong> {order.createdAt}
                    </CardText>
                  </Col>
                </Row>
                {/* Display cart items */}
                <CardTitle tag="h5" className="mt-3">
                  Cart Items
                </CardTitle>
                {cartItems && cartItems.length > 0 ? (
                  <Table striped>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Final Price</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={item._id}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.product.name}</td>
                          <td>{item.qty}</td>
                          <td>₹{item.product.price}</td>
                          <td>₹{item.product.price * item.qty}</td>
                          <td>
                            <img
                              src={`http://192.168.0.113:3001/uploads/${item.product.image}`}
                              alt={item.product.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <CardText>No cart items found</CardText>
                )}

                {/* Display transaction history */}
                <CardTitle tag="h5" className="mt-3">
                  Transaction History
                </CardTitle>
                {transactionHistory && transactionHistory.length > 0 ? (
                  <Table striped>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Payment ID</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((transaction, index) => (
                        <tr key={transaction.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{transaction.order_id}</td>
                          <td>{transaction.id}</td>
                          <td>{transaction.status}</td>
                          <td>₹{transaction.amount / 100}</td>
                          <td>
                            {new Date(
                              transaction.created_at * 1000
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <CardText>No transaction history found</CardText>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </section>
    </Fragment>
  );
};

export default OrderDetail;
