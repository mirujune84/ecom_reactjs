import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import ProductContext from "../../../Context/Product/ProductContext";
const ViewProduct = () => {
  const productContext = useContext(ProductContext);
  const { products, getProductById } = productContext;
  const navigate = useNavigate();
  console.log(products);
  // State to manage pagination settings
  const [perPage, setPerPage] = useState(10); // Default value
  const [currentPage, setCurrentPage] = useState(1); // Default value

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // Load pagination settings from local storage
      const savedPerPage = localStorage.getItem("perPage");
      const savedPage = localStorage.getItem("currentPage");
      if (savedPerPage) {
        setPerPage(parseInt(savedPerPage, 10));
        console.log("Loaded perPage from localStorage:", savedPerPage);
      }
      if (savedPage) {
        setCurrentPage(parseInt(savedPage, 10));
        console.log("Loaded currentPage from localStorage:", savedPage);
      }

      getProductById();
    } else {
      navigate("/login");
    }
  }, [getProductById, navigate]);

  useEffect(() => {
    // Save pagination settings to local storage whenever they change
    localStorage.setItem("perPage", perPage);
    console.log("Saved perPage to localStorage:", perPage);
    localStorage.setItem("currentPage", currentPage);
    console.log("Saved currentPage to localStorage:", currentPage);
  }, [perPage, currentPage]);

  return (
    <div>
      <Card>
        <CardBody>
          <div className="row">
            <div className="col-10">
              <CardTitle tag="h5">Product Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of product
              </CardSubtitle>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ViewProduct;
