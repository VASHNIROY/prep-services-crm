import React, { useState } from "react";
import "./index.css";
import Toast from "../utlis/toast";

const StaffSignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    role: "Admin",
  });

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    password: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrorMessages = { name: "", password: "", email: "" };

    if (formData.name === "") {
      newErrorMessages.name = "Name is required";
      isValid = false;
    }

    if (formData.password === "") {
      newErrorMessages.password = "Password is required";
      isValid = false;
    }

    if (formData.email === "") {
      newErrorMessages.email = "Email is required";
      isValid = false;
    }

    setErrorMessages(newErrorMessages);

    if (isValid) {
      const url = `${process.env.REACT_APP_FETCH_URL}staffregistration`;
      const jsonData = {
        name: formData.name,
        password: formData.password,
        email: formData.email,
        role: formData.role,
      };
      const token = sessionStorage.getItem("token");
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set the Content-Type to JSON
        },
        body: JSON.stringify(jsonData), // Convert JSON object to string
      })
        .then((response) => {
          if (response.status === 201) {
            response.json().then((data) => {
              Toast.fire({
                icon: "success",
                title: data.message,
              });
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "Admin",
              });
            });
          } else {
            response.json().then((data) => {
              Toast.fire({
                icon: "error",
                title: data.message,
              });
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "Admin",
              });
            });
          }
        })
        .catch(() => {
          setFormData({
            name: "",
            email: "",
            password: "",
            role: "Admin",
          });
        });
    }
  };

  return (
    <div className="">
    <div className="signup-div-container">
      <div className="login-image-container">
        <img
          src="https://www.ascarii.com/hubfs/Optimised-Customer-Service-v4.png"
          className="Login-image"
          alt=""
        />
      </div>
      <div className="signup-main-form-container">
        <center>
          <h2 className="signup-form-heading-container">Add Staff</h2>
        </center>
        <form onSubmit={handleSubmit} className="signup-form-container">
          <div className="signup-whole-form-contaner">
            <label className="signup-form-lable-container">Name</label>
            <input
              type="text"
              name="name"
              className="signin-input-text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your Name"
            />
          </div>
          <div className="signup-whole-form-contaner">
            <label className="signup-form-lable-container">Email ID</label>
            <input
              type="email"
              name="email"
              className="signin-input-text"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your Email"
            />
          </div>
          <div className="signup-whole-form-contaner">
            <label className="signup-form-lable-container">Password</label>
            <input
              type="password"
              name="password"
              className="signin-input-text"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your Password"
            />
          </div>
          <div className="signup-whole-form-contaner">
            <label className="signup-form-lable-container">Role</label>
            <select
              name="role"
              className="signin-input-text"
              value={formData.role}
              onChange={handleInputChange}
              
            >
              <option value="Admin">Admin</option>
              <option value="Dimension">Dimension</option>
              <option value="Label">Label</option>
              <option value="Accountant">Accountant</option>
              <option value="Dispatch">Dispatch</option>
            </select>
          </div>
          <div className="signup-whole-form-contaner">
            <button className="signup-form-button-container" type="submit">
              Signup
            </button>
          </div>
          <div>
            {errorMessages.name && (
              <p className="signup-error-messages">{errorMessages.name}</p>
            )}
            {errorMessages.password && (
              <p className="signup-error-messages">{errorMessages.password}</p>
            )}
            {errorMessages.email && (
              <p className="signup-error-messages">{errorMessages.email}</p>
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default StaffSignupPage;
