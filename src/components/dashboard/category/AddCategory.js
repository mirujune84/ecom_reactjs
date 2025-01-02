import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import CategoryContext from "../../../Context/Category/CategoryContext";
import { Card, CardBody } from "reactstrap";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const categoryContext = useContext(CategoryContext);
  const { categories, getCategory, addCategory } = categoryContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCategory();
    } else {
      navigate("/login");
    }
  }, [getCategory, navigate]);

  const [Category, setCategories] = useState({
    parent_id: "0",
    name: "",
    description: "",
    status: "active",
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await addCategory(
        Category.parent_id,
        Category.name,
        Category.description,
        Category.status
      );
      // props.showAlert("Added Successfully", "success"); // Show alert if needed
      navigate("/category"); // Redirect to CategoryTable route
    } catch (error) {
      console.error("There was an error adding the category!", error);
    }
  };

  const onChange = (e) => {
    setCategories({ ...Category, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setCategories({
      ...Category,
      parent_id: selectedOption ? selectedOption.value : "0",
    });
  };
  // const getParentCategoryName = (parent_id) => {
  //   const parentCategory = categories.find(
  //     (category) => category._id === parent_id
  //   );
  //   return parentCategory ? parentCategory.name : "";
  // };
  // const categoryOptions = categories.map((category) => {
  //   const parentName =
  //     category.parent_id !== "0"
  //       ? getParentCategoryName(category.parent_id)
  //       : "";
  //   return {
  //     value: category._id,
  //     label: parentName ? `${parentName} > ${category.name}` : category.name,
  //   };
  // });
  const getFullCategoryPath = (categoryId) => {
    let path = [];
    let currentId = categoryId;
  
    while (currentId !== "0") {
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
                type="text"
                name="description"
                className="form-control"
                id="description"
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
                value={Category.status}
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

export default AddCategory;
