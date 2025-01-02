import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios"; // Ensure you have axios installed

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#0f3460",
    color: "white",
    borderRadius: "5px",
    border: "none",
    boxShadow: "none",
    width: "200px",
    height: "40px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#0f3460" : "white",
    color: state.isSelected ? "white" : "#0f3460",
    "&:hover": {
      backgroundColor: "#0f3460",
      color: "white",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
};

const FilterSelect = ({ setFilterList }) => {
  const [options, setOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.113:3000/api/products/fetchallproduct"
        ); // Updated URL with port
        const productData = response.data;
        setAllProducts(productData);

        // Extract unique categories
        const categories = [
          ...new Set(productData.map((product) => product.category_id.name)),
        ];
        const formattedOptions = categories.map((cat) => ({
          value: cat,
          label: cat,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setFilterList(
        allProducts.filter(
          (item) => item.category_id.name === selectedOption.value
        )
      );
    } else {
      setFilterList(allProducts);
    }
  };

  return (
    <Select
      options={options}
      defaultValue={{ value: "All", label: "Filter By Category" }}
      styles={customStyles}
      onChange={handleChange}
    />
  );
};

export default FilterSelect;
