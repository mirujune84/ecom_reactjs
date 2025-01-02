import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import ProductContext from "../../../Context/Product/ProductContext";
import CategoryContext from "../../../Context/Category/CategoryContext";
import { Card, CardBody } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const productContext = useContext(ProductContext);
  const { editProduct, products, getProduct } = productContext;
  const categoryContext = useContext(CategoryContext);
  const { categories, getCategory } = categoryContext;
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL params

  const [Product, setProducts] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    status: "active",
    image: "", // Handle single image
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCategory();
      getProduct(); // Fetch the list of products
    } else {
      navigate("/login");
    }
  }, [getCategory, getProduct, navigate]);

  useEffect(() => {
    if (products && products.length) {
      const product = products.find((p) => p._id === id); // Find the product by ID
      if (product) {
        setProducts({
          category_id: product.category_id,
          name: product.name,
          description: product.description,
          status: product.status,
          price: product.price,
          image: product.image,
        });
      }
    }
  }, [products, id]);
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editProduct(
        id,
        Product.category_id._id,
        Product.name,
        Product.description,
        Product.status,
        Product.price,
        Product.image
      );
      navigate("/product"); // Redirect to CategoryTable route
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
  };

  const handleImageChange = (e) => {
    setProducts({
      ...Product,
      image: e.target.files[0], // Handle single file
    });
  };

  const onChange = (e) => {
    setProducts({ ...Product, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setProducts({
      ...Product,
      category_id: selectedOption ? selectedOption.value : "0",
    });
  };

  const getFullCategoryPath = (categoryId) => {
    let path = [];
    let currentId = categoryId;

    while (currentId !== "0") {
      // eslint-disable-next-line
      const category = categories.find((cat) => cat._id === currentId); //no-loop-func
      if (category) {
        path.unshift(category.name); // Add category name to the beginning of the path
        currentId = category.parent_id;
      } else {
        break;
      }
    }

    return path.join(" > "); // Join all parts with ' > '
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
                value={categoryOptions.find(
                  (option) => option.value === Product.category_id._id
                )} // Set selected category
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
                value={Product.name}
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
                value={Product.description}
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
                value={Product.price}
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
              {Product.image && !(Product.image instanceof File) && (
                <img
                  src={`http://192.168.0.113:3001/uploads/${Product.image}`} // Display current image URL
                  alt="Current product"
                  style={{ maxWidth: "100px", marginTop: "10px" }}
                />
              )}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={handleClick}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
};

export default EditProduct;
