import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import OrderContext from "../../../Context/Order/OrderContext";
import { ThreeDots } from "react-loader-spinner"; // Import the specific loader component

const ViewOrderDetail = () => {
  const orderContext = useContext(OrderContext);
  const { getOrderById, order, orderHistory, getOrderPaymentHistory } =
    orderContext;
  const navigate = useNavigate();
  const { id } = useParams(); // Get the order ID from the URL
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      getOrderById(id); // Fetch the order by ID
      getOrderPaymentHistory(id);
      getOrderPaymentHistory().finally(() => setLoading(false));
    } else {
      navigate("/login");
    }
  }, [getOrderById, id, navigate, getOrderPaymentHistory]);

  if (!order) {
    return <div>Loading...</div>; // Display a loading message or spinner while fetching
  }

  // Log the order object to check its structure
  console.log("Order Object:", order);
  console.log("Order History:", orderHistory);
  console.log("Cart Items:", order.cartItems);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Order Detail</CardTitle>
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <CardText>
              <strong>Order ID:</strong> {order.order?.orderId || "N/A"}
            </CardText>
            <CardText>
              <strong>Payment Id:</strong> {order.payment_id || "N/A"}
            </CardText>
            <CardText>
              <strong>User Name:</strong> {order.order?.name || "N/A"}
            </CardText>
            <CardText>
              <strong>Email:</strong> {order.order?.email || "N/A"}
            </CardText>
            <CardText>
              <strong>Mobile:</strong> {order.order?.mobile || "N/A"}
            </CardText>
          </Col>
          <Col md={6}>
            <CardText>
              <strong>Address:</strong> {order.order?.address || "N/A"}
            </CardText>
            <CardText>
              <strong>Total Amount:</strong> ₹
              {order.order?.totalAmount || "N/A"}
            </CardText>
            <CardText>
              <strong>Payment Status:</strong>{" "}
              {
                orderHistory?.data?.items.find(
                  (transaction) => order.payment_id === transaction.id
                )?.status
              }
            </CardText>
            <CardText>
              <strong>Order Status:</strong> {order.order?.status || "N/A"}
            </CardText>
            <CardText>
              <strong>Created At:</strong>{" "}
              {order.order?.createdAt
                ? new Date(order.order.createdAt).toLocaleString()
                : "N/A"}
            </CardText>
          </Col>
        </Row>
        {/* Display cart items */}
        <CardTitle tag="h5" className="mt-3">
          Cart Items
        </CardTitle>
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
        ) : order.cartItems && order.cartItems.length > 0 ? (
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
              {order.cartItems.map((item, index) => (
                <tr key={item._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.qty}</td>
                  <td>
                    <img
                      src={`http://192.168.0.113:3001/uploads/${item.image}`}
                      alt={item.name}
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

        <CardTitle tag="h5" className="mt-3">
          Transactions
        </CardTitle>

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
        ) : orderHistory?.data?.items && orderHistory.data.items.length > 0 ? (
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Order Id</th>
                <th>Payment Id</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.data.items.map((item, index) => (
                <tr key={item.order_id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.order_id}</td>
                  <td>{item.id}</td>
                  <td>₹{item.amount / 100}</td>
                  <td>
                    <span
                      className={`p-2 badge ${
                        item.status === "failed"
                          ? "badge-danger"
                          : "badge-success"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.method || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <CardText>No Transaction found</CardText>
        )}
      </CardBody>
    </Card>
  );
};

export default ViewOrderDetail;
