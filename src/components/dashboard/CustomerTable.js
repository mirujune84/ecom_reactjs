import React from "react";
import DataTable from "react-data-table-component";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

// Example data for product categories
const customerData = [
  {
    id: 1,
    name: "Electronics",
    description: "Gadgets and devices",
    status: "1",
  },
  {
    id: 2,
    name: "Furniture",
    description: "Home and office furniture",
    status: "2",
  },
  {
    id: 3,
    name: "Clothing",
    description: "Men’s and Women’s clothing",
    status: "1",
  },
  {
    id: 4,
    name: "Books",
    description: "Various genres of books",
    status: "1",
  },
];

// Define columns for the DataTable
const columns = [
  {
    name: "#",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
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
          row.status === "1" ? "bg-success" : "bg-danger"
        }`}
      ></span>
    ),
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="d-flex">
        <i className="bi bi-pencil-square mx-2 text-primary"></i>
        <i className="bi bi-trash3 mx-2 text-danger"></i>
        <i className="bi bi-eye mx-2 text-warning"></i>
      </div>
    ),
  },
];

const CustomerTable = () => {
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
            data={customerData}
            pagination
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
