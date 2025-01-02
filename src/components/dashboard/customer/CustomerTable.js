import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import CustomerContext from "../../../Context/Customer/CustomerContext";
import Swal from "sweetalert2";
// Example data for product categories
const CustomerTable = () => {
  const customerContext = useContext(CustomerContext);
  const { customers, getCustomer, deleteCustomer } = customerContext;
  const navigate = useNavigate();

  // State to manage pagination settings
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
      getCustomer();
    } else {
      navigate("/login");
    }
  }, [getCustomer, navigate]);

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
      name: "Customer Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Address",
      selector: (row) => row.address ?? "-",
      sortable: true,
      width: "200px",
    },
    {
      name: "Pin Code",
      selector: (row) => row.pincode ?? "-",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <i
            className="bi bi-trash3 mx-2 text-danger"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteCustomer(row._id);
                }
              });
            }}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Customers Listing</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            Overview of Customers
          </CardSubtitle>

          <DataTable
            columns={columns}
            data={customers}
            pagination
            paginationPerPage={perPage}
            paginationDefaultPage={currentPage}
            paginationTotalRows={customers.length}
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

export default CustomerTable;
