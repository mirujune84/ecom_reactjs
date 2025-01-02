import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import CategoryContext from "../../../Context/Category/CategoryContext";
import Swal from "sweetalert2";

const CategoryTable = () => {
  const categoryContext = useContext(CategoryContext);
  const { categories, getCategory, deleteCategory } = categoryContext;
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
      getCategory();
    } else {
      navigate("/login");
    }
  }, [getCategory, navigate]);

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

  const getFullCategoryPath = (categoryId) => {
    let path = [];
    let currentId = categoryId;

    while (currentId !== "0") {
      // eslint-disable-next-line
      const category = categories.find((cat) => cat._id === currentId);
      if (category) {
        path.unshift(category.name);
        currentId = category.parent_id;
      } else {
        break;
      }
    }

    return path.join(" > ");
  };

  const columns = [
    {
      name: "Category Name",
      selector: (row) => row.name,
      cell: (row) => {
        const parentName =
          row.parent_id !== "0" ? getFullCategoryPath(row.parent_id) : "";
        return parentName ? `${parentName} > ${row.name}` : row.name;
      },
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
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
            onClick={() => navigate(`/edit-category/${row._id}`)}
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
                  deleteCategory(row._id);
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
          <div className="row">
            <div className="col-10">
              <CardTitle tag="h5">Product Category Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of product categories
              </CardSubtitle>
            </div>
            <div className="col-2 text-end">
              <Link className="btn btn-primary" to="/add-category">
                Add Category
              </Link>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={categories}
            pagination
            paginationPerPage={perPage}
            paginationDefaultPage={currentPage}
            paginationTotalRows={categories.length}
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

export default CategoryTable;
