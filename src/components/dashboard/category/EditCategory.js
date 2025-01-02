import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import CategoryContext from "../../../Context/Category/CategoryContext";
import { Card, CardBody } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const categoryContext = useContext(CategoryContext);
  const { categories, getCategory, getCategoryById, editCategory, category } =
    categoryContext;
  const navigate = useNavigate();
  const { id } = useParams(); // Get the category ID from the URL

  const [Category, setCategory] = useState({
    parent_id: "0",
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCategory();
      getCategoryById(id); // Fetch the category by ID
    } else {
      navigate("/login");
    }
  }, [getCategory, getCategoryById, id, navigate]);

  useEffect(() => {
    if (category) {
      setCategory({
        parent_id: category.parent_id || "0",
        name: category.name,
        description: category.description,
        status: category.status,
      });
    }
  }, [category]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await editCategory(
        id,
        Category.parent_id,
        Category.name,
        Category.description,
        Category.status
      );
      navigate("/category"); // Redirect to CategoryTable route
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
  };

  const onChange = (e) => {
    setCategory({ ...Category, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setCategory({
      ...Category,
      parent_id: selectedOption ? selectedOption.value : "0",
    });
  };

  const getFullCategoryPath = (categoryId) => {
    let path = [];
    let currentId = categoryId;

    while (currentId !== "0") {
      // eslint-disable-next-line
      const category = categories.find((cat) => cat._id === currentId);
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
          <form className="row g-3 needs-validation" noValidate>
            <div className="col-md-6">
              <label htmlFor="parent_id" className="form-label">
                Parent Category
              </label>
              <Select
                id="parent_id"
                name="parent_id"
                options={categoryOptions}
                onChange={handleSelectChange}
                value={categoryOptions.find(
                  (option) => option.value === Category.parent_id
                )}
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
                value={Category.name}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                className="form-control"
                id="description"
                required
                value={Category.description}
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
                value={Category.status}
                onChange={onChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={handleClick}
              >
                Submit form
              </button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  );
};

export default EditCategory;
