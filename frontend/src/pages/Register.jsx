import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = (props) => {
  const host = "http://192.168.0.113:3001";
  let history = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  //   const { name, eamil, password } = credentials;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/api/customer/createcustomer`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(credentials), // Send credentials as a single object
      });
      const json = await response.json();
      console.log(json);
      if (json.authToken !== "") {
        localStorage.setItem("token", json.authToken);
        localStorage.setItem("user_data", JSON.stringify(json.customer));
        history("/");
        toast.success("User registerd successfully.");
      } else {
        toast.danger("Invalid Credentials");
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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
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
              aria-describedby="emailHelp"
              onChange={onChange}
            />
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
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="cpassword"
              className="form-control"
              id="cpassword"
              name="cpassword"
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>
    </Fragment>
  );
};

export default Register;
