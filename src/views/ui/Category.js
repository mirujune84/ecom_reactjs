import React from "react";
import { Row, Col } from "reactstrap";
import CategoryTable from "../../components/dashboard/category/CategoryTable";
const Category = () => {
  return (
    <Row>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-1*/}
      {/* --------------------------------------------------------------------------------*/}
      <Col lg="12">
        <CategoryTable />
      </Col>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-2*/}
      {/* --------------------------------------------------------------------------------*/}
    </Row>
  );
};

export default Category;
