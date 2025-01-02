import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

import "./App.css";

const Login = () => {
  const host = "http://192.168.0.113:3001";
  let history = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials), // Send credentials as a single object
      });
      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authToken);
        toast.success("Login successful!");
        history("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6"></div>

        <div className="col-lg-12 d-flex align-items-center justify-content-center right-side">
          <div className="form-2-wrapper">
            <div className="logo text-center">
              <h2>Ecommerce Admin</h2>
            </div>
            <h2 className="text-center mb-4">Sign Into Your Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 form-box">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={credentials.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                  <a
                    href="forget-3.html"
                    className="text-decoration-none float-end"
                  >
                    Forget Password
                  </a>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-outline-secondary login-btn w-100 mb-3"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Login;
