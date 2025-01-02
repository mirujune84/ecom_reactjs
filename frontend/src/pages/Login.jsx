import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = (props) => {
  const host = "http://192.168.0.113:3001";

  let history = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/api/customer/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials), // Send credentials as a single object
      });
      const json = await response.json();
      console.log(json);
      if (json.success === true) {
        localStorage.setItem("token", json.authToken);
        localStorage.setItem("user_data", JSON.stringify(json.customer));

        history("/");
        toast.success("Login successfully");
      } else {
        toast.warning("Please login with correct credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <section className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              aria-describedby="emailHelp"
              value={credentials.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <Link to={"/register"}>Create Your Account</Link>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </Fragment>
  );
};

export default Login;
