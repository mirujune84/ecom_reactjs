import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import ProductContext from "../../../Context/Product/ProductContext";
import CategoryContext from "../../../Context/Category/CategoryContext";
import { Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const productContext = useContext(ProductContext);
  const { getProduct, addProduct } = productContext;
  const categoryContext = useContext(CategoryContext);
  const { categories, getCategory } = categoryContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getProduct();
      getCategory(); // Fetch categories if needed
    } else {
      navigate("/login");
    }
  }, [getProduct, getCategory, navigate]);

  const [Product, setProducts] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    status: "active",
    image: "", // Change to a single image
  });

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", Product.category_id);
    formData.append("name", Product.name);
    formData.append("description", Product.description);
    formData.append("price", Product.price);
    formData.append("status", Product.status);
    formData.append("image", Product.image); // Append single image

    try {
      await addProduct(formData);
      navigate("/product"); // Redirect to Product route
    } catch (error) {
      console.error("There was an error adding the product!", error);
    }
  };

  const onChange = (e) => {
    setProducts({ ...Product, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setProducts({
      ...Product,
      category_id: selectedOption?.value ?? "",
    });
  };

  const handleImageChange = (e) => {
    setProducts({
      ...Product,
      image: e.target.files[0], // Handle single file
    });
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

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: getFullCategoryPath(category._id),
  }));

  return (
    <Card>
      <CardBody>
        <div>
          <form
            className="row g-3 needs-validation"
            encType="multipart/form-data"
            noValidate
          >
            <div className="col-md-6">
              <label htmlFor="category_id" className="form-label">
                Parent Category
              </label>
              <Select
                id="category_id"
                name="category_id"
                options={categoryOptions}
                onChange={handleSelectChange}
                isClearable
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                required
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                className="form-control"
                id="description"
                required
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                required
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                name="status"
                className="form-control"
                id="status"
                required
                onChange={onChange}
                value={Product.status}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={handleClick}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddProduct;
