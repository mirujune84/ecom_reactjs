import React, { useCallback, useState } from "react";
import OrderContext from "./OrderContext";

const OrderState = (props) => {
  const host = "http://192.168.0.113:3001";
  const initialProductArray = [];

  const [orders, setOrders] = useState(initialProductArray);
  const [order, setOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);

  const getOrders = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/order/fetchallorders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const json = await response.json();
      setOrders(json);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [host]);

  const getOrderById = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${host}/api/order/getorderbyid/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order by ID");
        }

        const json = await response.json();
        setOrder(json);
      } catch (error) {
        console.error("Error fetching order by ID:", error);
      }
    },
    [host]
  );

  const getOrderPaymentHistory = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${host}/api/payment/orderpayments/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order payment history");
        }

        const json = await response.json();
        setOrderHistory(json);
      } catch (error) {
        console.error("Error fetching order payment history:", error);
      }
    },
    [host]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        order,
        setOrders,
        setOrder,
        getOrders,
        getOrderById,
        orderHistory,
        setOrderHistory,
        getOrderPaymentHistory,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderState;
