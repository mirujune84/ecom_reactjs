import React, { useEffect, useContext, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import TransactionContext from "../../../Context/Transaction/TransactionContext";

const TransactionTable = () => {
  const transactionContext = useContext(TransactionContext);
  const { transactions, getTransaction } = transactionContext;
  const navigate = useNavigate();

  const [perPage, setPerPage] = useState(() => {
    // Load perPage from local storage or use default value
    const savedPerPage = localStorage.getItem("perPage");
    return savedPerPage ? parseInt(savedPerPage, 10) : 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // Load currentPage from local storage or use default value
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTransaction();
    } else {
      navigate("/login");
    }
  }, [getTransaction, navigate]);

  useEffect(() => {
    // Save pagination settings to local storage whenever they change
    localStorage.setItem("perPage", perPage);
    localStorage.setItem("currentPage", currentPage);
  }, [perPage, currentPage]);

  const handlePerPageChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      name: "Transaction Id",
      selector: (row) => row.payment_id ?? "-",
      sortable: true,
    },
    {
      name: "Order Id",
      selector: (row) => row.order_id ?? "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email ?? "-",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.transaction_amount}`, // Assuming amount is in paise
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`p-2 badge ${
            row.status === "success" ? "badge-success" : "badge-danger"
          }`}
        >
          {row.status === "success" ? "Paid" : "Failed"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.date).toLocaleString(), // Convert timestamp to date
      sortable: true,
    },
  ];

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Transaction Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of all transactions
          </CardSubtitle>

          <DataTable
            columns={columns}
            data={transactions || []} // Safely access items
            pagination
            paginationPerPage={perPage}
            paginationDefaultPage={currentPage}
            paginationTotalRows={transactions.count || 0} // Safely access count
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerPageChange}
            responsive
            striped
            highlightOnHover
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default TransactionTable;
