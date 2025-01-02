import React, { useCallback, useState } from "react";
import TransactionContext from "./TransactionContext";
const TransactionState = (props) => {
  const host = "http://192.168.0.113:3001";
  const initialProductArray = [];

  const [transactions, setTransactions] = useState(initialProductArray);
  const [transaction, setTransaction] = useState(null);

  const getTransaction = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/payment/alltransaction`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setTransactions(json);
    } catch (error) {
      console.error("There was an error fetching product!", error);
    }
  }, [host]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transaction,
        setTransactions,
        setTransaction,
        getTransaction,
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
