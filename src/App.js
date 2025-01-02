import React from "react";
import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import CategoryState from "./Context/Category/CategoryState";
import ProductState from "./Context/Product/ProductState";
import CustomerState from "./Context/Customer/CustomerState";
import TransactionState from "./Context/Transaction/TransactionState";
import OrderState from "./Context/Order/OrderState";

const App = () => {
  const routing = useRoutes(Themeroutes);
  return (
    <CategoryState>
      <ProductState>
        <CustomerState>
          <TransactionState>
            <OrderState>
              <div className="dark">{routing}</div>
            </OrderState>
          </TransactionState>
        </CustomerState>
      </ProductState>
    </CategoryState>
  );
};

export default App;
