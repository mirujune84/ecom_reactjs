import React, { useCallback, useState } from "react";
import CategoryContext from "./CategoryContext";
import Swal from "sweetalert2";

const CategoryState = (props) => {
  const host = "http://192.168.0.113:3001";
  const initialCategoryArray = [];

  const [categories, setCategories] = useState(initialCategoryArray);
  const [category, setCategory] = useState(null);

  const getCategory = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/category/fetchallcategory`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setCategories(json);
    } catch (error) {
      console.error("There was an error fetching categories!", error);
    }
  }, [host]);

  const addCategory = async (parent_id, name, description, status) => {
    try {
      const response = await fetch(`${host}/api/category/addcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ parent_id, name, description, status }),
      });

      const json = await response.json();
      setCategories(categories.concat(json));
    } catch (error) {
      console.error("There was an error adding the category!", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${host}/api/category/deletecategory/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
        const newCategory = categories.filter(
          (category) => category._id !== id
        );
        setCategories(newCategory);
        // Optionally, you might want to refresh the data or update the UI
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Server error. Please try again later.", "error");
    }
  };

  const editCategory = async (id, parent_id, name, description, status) => {
    try {
      const response = await fetch(
        `${host}/api/category/updatecategory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ parent_id, name, description, status }),
        }
      );

      const json = await response.json();
      setCategories(
        categories.map((category) => (category._id === id ? json : category))
      );
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
  };

  const getCategoryById = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${host}/api/category/getcategorybyid/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        const json = await response.json();
        setCategory(json);
      } catch (error) {
        console.error("There was an error fetching the category by ID!", error);
      }
    },
    [host]
  );

  return (
    <CategoryContext.Provider
      value={{
        categories,
        category,
        setCategories,
        addCategory,
        deleteCategory,
        editCategory,
        getCategory,
        getCategoryById,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
