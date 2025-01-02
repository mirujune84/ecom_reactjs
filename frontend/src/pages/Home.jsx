import { Fragment, useEffect, useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";

const Home = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.113:3001/api/products/fetchallproduct"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const newArrivalData = products.filter(
    (item) => item.category_id.name === "Mans"
  );
  const bestSales = products.filter((item) => item.category_id.name === "T-shirts");
  useWindowScrollToTop();
  return (
    <Fragment>
      <SliderHome />
      <Wrapper />
      <Section title="Big Discount" bgColor="#f6f9fc" productItems={products} />
      <Section
        title="New Arrivals"
        bgColor="white"
        productItems={newArrivalData}
      />
      <Section title="Best Sales" bgColor="#f6f9fc" productItems={bestSales} />
    </Fragment>
  );
};

export default Home;
