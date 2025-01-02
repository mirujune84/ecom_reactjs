import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you are using react-router for routing
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios"; // Ensure you have axios installed
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the route params
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.113:3001/api/products/getproductbyid/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1)); // Ensure quantity is at least 1
  };

  const handleAdd = () => {
    if (!product) {
      toast.error("Product not found!");
      return;
    }
    dispatch(addToCart({ product, num: quantity }));
    toast.success("Product has been added to cart!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }
  console.log(product);
  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <img
              loading="lazy"
              src={`http://192.168.0.113:3001/uploads/${product.image}`}
              alt={product.name}
            />
          </Col>
          <Col md={6}>
            <h2>{product.name}</h2>
            <div className="rate">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa fa-star${i < product.avgRating ? "" : ""}`}
                  ></i>
                ))}
              </div>
              <span>{product.avgRating} ratings</span>
            </div>
            <div className="info">
              <span className="price">₹{product.price}</span>
              <span>Category: {product.category_id.name}</span>
            </div>
            <p>{product.description}</p>
            <input
              className="qty-input"
              type="number"
              min="1"
              placeholder="Qty"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              aria-label="Add to cart"
              type="button"
              className="add"
              onClick={handleAdd}
            >
              Add To Cart
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
