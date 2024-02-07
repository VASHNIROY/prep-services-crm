import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import React Router
import "./index.css";
import Toast from "../utlis/toast";
import axxpress from "../images/axxpress.png";
import staffImage from "../utlis/staff-signup-3.jpg";

const StaffSigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("sname");
  const [error, setError] = useState(""); // State variable for error message
  const navigate = useNavigate(); // Get access to the navigation history
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages
    const url = `${FETCH_URL}stafflogin`;
    const jsonData = {
      email: formData.email,
      password: formData.password,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
      body: JSON.stringify(jsonData), // Convert JSON object to string
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            Toast.fire({
              icon: "success",
              title: data.message,
            });
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("sname", data.name);
            setTimeout(() => {
              if (data.role === "Admin") {
                navigate("/admin");
              } else if (data.role === "Label") {
                navigate("/labelOrders");
              } else if (data.role === "Dimension") {
                navigate("/dimensionorders");
              } else if (data.role === "Accountant") {
                navigate("/accountOrders");
              } else if (data.role === "Dispatch") {
                navigate("/dispatch");
              }
            }, 100);
          });
        } else if (response.status === 400) {
          response.json().then((data) => {
            Toast.fire({
              icon: "error",
              title: data.message,
            });
          });
        } else {
          response.json().then((data) => {
            Toast.fire({
              icon: "error",
              title: data.message,
            });
          });
        }
      })
      .catch((error) => {
        setError("Error occurred during login");
      });
  };

  return (
    <>
      <div className="customer-signin-sub-container">
        <div className="signin-div-container">
          <div className="login-image-container">
            <img src={staffImage} className="Login-image" alt="" />
          </div>
          <div className="signin-form-main-container">
            <img className="logo-image-axxpress" src={axxpress} alt="" />
            <center>
              <h2 className="signin-form-heading-container">Staff Login</h2>
            </center>
            <form onSubmit={handleSubmit} className="signin-form-container">
              <div className="signin-form-group-container">
                <label className="signin-form-label-container">Email ID</label>
                <input
                  type="email"
                  name="email"
                  className="signin-input-text"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Your Email"
                />
              </div>
              <div className="signin-form-group-container">
                <label className="signin-form-label-container">Password</label>
                <input
                  type="password"
                  name="password"
                  className="signin-input-text"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Your Password"
                />
              </div>
              <center>
                <button className="signin-form-button-container" type="submit">
                  Sign In
                </button>
                {error && <p className="error-message">{error}</p>}{" "}
              </center>
              <Link
                to="/StaffForgotPassword"
                style={{ textDecoration: "none", textAlign: "center" }}
              >
                <p>Forgot Password</p>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffSigninPage;
