import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import ProductContext from "../../../Context/Product/ProductContext";
import Swal from "sweetalert2";
const ProductTable = () => {
  const productContext = useContext(ProductContext);
  const { products, getProduct, deleteProduct } = productContext;
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
      getProduct();
    } else {
      navigate("/login");
    }
  }, [getProduct, navigate]);

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
      name: "Image",
      selector: (row) => row.image,
      cell: (row) => (
        <img
          src={`http://192.168.0.113:3001/uploads/${row.image}`}
          alt={row.image || "Product image"}
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: false,
      width: "150px",
    },
    {
      name: "Category ID",
      selector: (row) => (row.category_id ? row.category_id.name : "N/A"),
      sortable: true,
      width: "150px",
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      cell: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`p-2 rounded-circle d-inline-block ${
            row.status === "active" ? "bg-success" : "bg-danger"
          }`}
        ></span>
      ),
      sortable: true,
      width: "100px",
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <i
            className="bi bi-pencil-square mx-2 text-primary"
            onClick={() => navigate(`/edit-product/${row._id}`)}
            style={{ cursor: "pointer" }}
          ></i>
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
                  deleteProduct(row._id); // Call deleteCategory if confirmed
                  Swal.fire(
                    "Deleted!",
                    "Your product has been deleted.",
                    "success"
                  );
                }
              });
            }}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="bi bi-eye mx-2 text-warning"
            onClick={() => navigate(`/view-product/${row._id}`)}
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
          <div className="row">
            <div className="col-10">
              <CardTitle tag="h5">Product Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of product
              </CardSubtitle>
            </div>
            <div className="col-2 text-end">
              <Link className="btn btn-primary" to="/add-product">
                Add Product
              </Link>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={products}
            pagination
            paginationPerPage={perPage}
            paginationDefaultPage={currentPage}
            paginationTotalRows={products.length}
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

export default ProductTable;
