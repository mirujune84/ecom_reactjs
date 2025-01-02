import React from "react";
import { Row, Col } from "reactstrap";
import SubcategoryTable from "../../components/dashboard/SubcategoryTable";
const Subcategory = () => {
  return (
    <Row>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-1*/}
      {/* --------------------------------------------------------------------------------*/}
      <Col lg="12">
        <SubcategoryTable />
      </Col>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-2*/}
      {/* --------------------------------------------------------------------------------*/}
    </Row>
  );
};

export default Subcategory;
