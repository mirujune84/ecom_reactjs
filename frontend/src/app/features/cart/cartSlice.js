import { createSlice } from "@reduxjs/toolkit";

const storedCartList = localStorage.getItem("cartList")
  ? JSON.parse(localStorage.getItem("cartList"))
  : [];

const initialState = {
  cartList: Array.isArray(storedCartList) ? storedCartList : [], // Ensure it's an array
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, num } = action.payload;
      console.log("Current cart state:", state.cartList);

      if (!Array.isArray(state.cartList)) state.cartList = []; // Safeguard: Ensure it's an array

      const existingProduct = state.cartList.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        existingProduct.qty += num;
      } else {
        state.cartList.push({ ...product, qty: num });
      }

      console.log("Updated cart state:", state.cartList);
    },
    decreaseQty: (state, action) => {
      const productToDecreaseQty = action.payload;

      if (!Array.isArray(state.cartList)) state.cartList = []; // Safeguard: Ensure it's an array

      const productExist = state.cartList.find(
        (item) => item._id === productToDecreaseQty._id
      );

      if (productExist) {
        if (productExist.qty === 1) {
          state.cartList = state.cartList.filter(
            (item) => item._id !== productExist._id
          );
        } else {
          state.cartList = state.cartList.map((item) =>
            item._id === productExist._id
              ? { ...item, qty: item.qty - 1 }
              : item
          );
        }
      }

      // Debugging
      console.log("Updated cart list:", state.cartList);
    },
    deleteProduct: (state, action) => {
      const productToDelete = action.payload;

      if (!Array.isArray(state.cartList)) state.cartList = []; // Safeguard: Ensure it's an array

      state.cartList = state.cartList.filter(
        (item) => item._id !== productToDelete._id // Ensure consistent field name
      );

      // Debugging
      console.log("Updated cart list:", state.cartList);
    },
    clearCart: (state) => {
      state.cartList = [];
    },
  },
});

export const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith("cart/")) {
    const cartList = store.getState().cart.cartList;
    if (Array.isArray(cartList)) {
      localStorage.setItem("cartList", JSON.stringify(cartList));
    } else {
      console.error("cartList is not an array:", cartList);
    }
  }
  return result;
};

export const { addToCart, decreaseQty, deleteProduct, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
