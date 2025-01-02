import React, { useCallback, useState } from "react";
import CustomerContext from "./CustomerContext";
import Swal from "sweetalert2";

const CustomerState = (props) => {
  const host = "http://192.168.0.113:3001";
  const initialCustomerArray = [];

  const [customers, setCustomers] = useState(initialCustomerArray);
  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await fetch(`${host}/api/customer/getallcustomers`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setCustomers(json);
    } catch (error) {
      console.error("There was an error fetching customer!", error);
    }
  }, [host]);

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(
        `${host}/api/customer/deletecustomer/${id}`,
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
        Swal.fire("Deleted!", "Customer has been deleted.", "success");
        const newCustomer = customers.filter((customer) => customer._id !== id);
        setCustomers(newCustomer);
        // Optionally, you might want to refresh the data or update the UI
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Server error. Please try again later.", "error");
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        deleteCustomer,
        getCustomer,
        customer,
        setCustomer,
      }}
    >
      {props.children}
    </CustomerContext.Provider>
  );
};

export default CustomerState;
