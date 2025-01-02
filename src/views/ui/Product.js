import React from "react";
import { Row, Col } from "reactstrap";
import ProductTable from "../../components/dashboard/product/ProductTable";
const Product = () => {
  return (
    <Row>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-1*/}
      {/* --------------------------------------------------------------------------------*/}
      <Col lg="12">
        <ProductTable />
      </Col>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-2*/}
      {/* --------------------------------------------------------------------------------*/}
    </Row>
  );
};

export default Product;
