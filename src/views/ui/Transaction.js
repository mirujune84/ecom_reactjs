import React from "react";
import { Row, Col } from "reactstrap";
import TransactionTable from "../../components/dashboard/transaction/TransactionTable";
const Transaction = () => {
  return (
    <Row>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-1*/}
      {/* --------------------------------------------------------------------------------*/}
      <Col lg="12">
        <TransactionTable />
      </Col>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-2*/}
      {/* --------------------------------------------------------------------------------*/}
    </Row>
  );
};

export default Transaction;
