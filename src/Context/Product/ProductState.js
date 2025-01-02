import React, { useCallback, useState } from "react";
import ProductContext from "./ProductContext";
const ProductState = (props) => {
  const host = "http://192.168.0.113:3001";
  const initialProductArray = [];

  const [products, setProducts] = useState(initialProductArray);
  const [product, setProduct] = useState(null);

  const getProduct = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/products/fetchallproduct`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setProducts(json);
    } catch (error) {
      console.error("There was an error fetching product!", error);
    }
  }, [host]);

  const addProduct = async (formData) => {
    try {
      const response = await fetch(`${host}/api/products/addproduct`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData, // Send FormData directly
      });
      const json = await response.json();
      console.log(json);
      setProducts(products.concat(json));
    } catch (error) {
      console.error("There was an error adding the product!", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${host}/api/products/deleteproduct/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      const newProducts = products.filter((category) => category._id !== id);
      setProducts(newProducts);
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  const editProduct = async (
    id,
    category_id,
    name,
    description,
    status,
    price,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append("category_id", category_id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${host}/api/products/updateproduct/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      });

      const json = await response.json();
      setProducts(
        products.map((product) => (product._id === id ? json : product))
      );
    } catch (error) {
      console.error("There was an error updating the product!", error);
    }
  };

  const getProductById = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${host}/api/products/getproductbyid/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        const json = await response.json();
        setProduct(json);
      } catch (error) {
        console.error("There was an error fetching the category by ID!", error);
      }
    },
    [host]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        setProducts,
        addProduct,
        deleteProduct,
        editProduct,
        getProduct,
        getProductById,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
