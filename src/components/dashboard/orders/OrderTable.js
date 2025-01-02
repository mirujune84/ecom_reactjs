import React, { useEffect, useContext, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
// import TransactionContext from "../../../Context/Transaction/TransactionContext";
import OrderContext from "../../../Context/Order/OrderContext";
import { ThreeDots } from "react-loader-spinner"; // Import the specific loader component

const OrderTable = () => {
  const orderContext = useContext(OrderContext);
  const { orders, getOrders } = orderContext;
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
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true); // Set loading to true when starting fetch
      getOrders().finally(() => setLoading(false)); // Set loading to false when fetch completes
    } else {
      navigate("/login");
    }
  }, [getOrders, navigate]);

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

  // Sort orders in descending order based on createdAt
  const sortedOrders = (orders || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const columns = [
    {
      name: "OrderId",
      selector: (row) => row.orderId ?? "-",
      sortable: true,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row) => row.name ?? "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email ?? "-",
      sortable: true,
      width: "200px",
    },
    {
      name: "Contact",
      selector: (row) => row.mobile ?? "-",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `₹${row.totalAmount}` ?? "-",
      sortable: true,
      width: "80px",
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`p-2 badge ${
            row.status === "attempted" ? "badge-danger" : "badge-success"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleString(), // Convert timestamp to date
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <i
            className="bi bi-eye mx-2 text-primary"
            onClick={() => navigate(`/view-order/${row.orderId}`)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      ),
      width: "100px",
    },
  ];

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Orders Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of all orders
          </CardSubtitle>
          {loading ? (
            <div className="d-flex justify-content-center">
              <ThreeDots color="#00BFFF" height={80} width={80} />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={sortedOrders} // Use sorted data
              pagination
              paginationPerPage={perPage}
              paginationDefaultPage={currentPage}
              paginationTotalRows={sortedOrders.length} // Update total rows count
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerPageChange}
              responsive
              striped
              highlightOnHover
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderTable;
