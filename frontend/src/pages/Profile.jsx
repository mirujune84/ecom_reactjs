import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Banner from "../components/Banner/Banner";

const Profile = (props) => {
  const host = "http://192.168.0.113:3001";
  const navigate = useNavigate();
  const storedUserData = localStorage.getItem("user_data");
  let userData = {};

  if (storedUserData) {
    try {
      userData = JSON.parse(storedUserData);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", userData);
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      localStorage.removeItem("user_data");
    }
  } else {
    console.log("No user_data found in localStorage.");
  }

  const [credentials, setCredentials] = useState({
    name: userData.name || "",
    email: userData.email || "",
    address: userData.address || "",
    pincode: userData.pincode || "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const userId = userData._id; // Assuming user_data contains the user's ID
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${host}/api/customer/updatecustomer/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(credentials),
        }
      );
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        localStorage.setItem("user_data", JSON.stringify(json));
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <Banner title="Profile" />
      <section className="container filter-bar">
        <form >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={credentials.name}
              aria-describedby="nameHelp"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              aria-describedby="emailHelp"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pincode" className="form-label">
              Pin Code
            </label>
            <input
              type="text"
              className="form-control"
              id="pincode"
              name="pincode"
              value={credentials.pincode}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={credentials.address}
              onChange={onChange}
            />
          </div>
          <button type="submit" onClick={handleClick} className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </Fragment>
  );
};

export default Profile;
