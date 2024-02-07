import React, { useState } from "react";

import Toast from "../utlis/toast";
import { Link, useNavigate } from "react-router-dom";
import axxpress from '../images/axxpress.png'
import Button from "../Button"
import signup from '../utlis/signup-img-2.png'

const Customersignup2 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoader(true)
    if (!formData.name.trim()) {
      Toast.fire({
        icon: "error",
        title: "Name is required",
      });
      setShowLoader(false)
      return
    }
    if (!formData.email.trim()) {
      Toast.fire({
        icon: "error",
        title: "Email is required",
      });
      setShowLoader(false)
      return
    }
    if (!formData.password.trim()) {
      Toast.fire({
        icon: "error",
        title: "Password is required",
      });
      setShowLoader(false)
      return
    }
    if (!confirmPassword.trim()) {
      Toast.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      setShowLoader(false)
      return
    }
    if (formData.password !== confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      setShowLoader(false)
      return
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    fetch(
      `${process.env.REACT_APP_FETCH_URL}customerregistration`,
      requestOptions
    )
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            localStorage.setItem("email", formData.email);
            Toast.fire({
              icon: "success",
              title: data.message,
            });
            setFormData({
              name: "",
              email: "",
              password: "",
            });
            setConfirmPassword("");
            navigate("/CustomerOtpVerification");
          });
          setShowLoader(false)
        } else {
          response.json().then((data) => {
            Toast.fire({
              icon: "error",
              title: data.message,
            });
            setShowLoader(false)
            // Set isModalOpen to false if the status is not 200
            setFormData({
              name: "",
              email: "",
              password: "",
            });
            setConfirmPassword("");
          });
        }
      })
      .catch(() => {
        Toast.fire({
          icon: "error",
          title: "An error occurred while processing your request"
        });
        setShowLoader(false)
      });
  };

  return (
    <div className="customer-signin-sub-container">
    <div className="customer-signin-div-container">
      
      <div className="login-image-container">
        <img
          src={signup}
          className="Login-image"
          alt=""
        />
      </div>
      <div className="customer-signin-form-main-container">
      <img className='logo-image-axxpress' src={axxpress} alt=''/>

        <center>
          <h2 className="customer-signin-form-heading-container">
            Signup
          </h2>
        </center>
        <form
          onSubmit={handleSubmit}
          className="customer-singin-form-container"
        >
          <div className="customer-signin-form-group-container">
            <label className="customer-singnin-form-lable-container">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="customer-signin-input-container"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div className="customer-signin-form-group-container">
            <label className="customer-singnin-form-lable-container">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              className="customer-signin-input-container"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="customer-signin-form-group-container">
            <label className="customer-singnin-form-lable-container">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="customer-signin-input-container"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="customer-signin-form-group-container">
            <label className="customer-singnin-form-lable-container">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="customer-signin-input-container"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="Enter Your Confirm Password"
              required
            />  
          </div>
          <div className="customer-signin-form-group-container">
            <center>
          <Button
              text="Sign Up"
              type="Submit"
              loading={showLoader}
              disabled={showLoader}
            />
            </center>
           
            <center>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p style={{fontSize:"17px",color:"#212d45",fontWeight:"600"}}><span style={{color:"#b3b3b3",fontSize:"14px",fontWeight:"500"}}>Do you have account Already?</span> Login</p>
            </Link>
            </center>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Customersignup2;
