import React, { useState } from "react";
import "./index.css";
import Toast from "../utlis/toast";
import Button from "../Button";
const Customersignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoader(true)
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Name is required";
      setShowLoader(false)
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
      setShowLoader(false)
    }
   

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = sessionStorage.getItem("token");
    // Construct the request object with the POST method and the request body as JSON
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
      body: JSON.stringify(formData),
    };

    fetch(`${process.env.REACT_APP_FETCH_URL}registration`, requestOptions)
      .then((response) => {
        if (response.status === 201) {
          response.json().then((data) => {
            Toast.fire({
              icon: "success",
              title: data.message,
            });
            setShowLoader(false)
            setFormData({
              name: "",
              email: "",
            });
          });
          
          
        } else {
          response.json().then((data) => {
            Toast.fire({
              icon: "error",
              title: data.message,
            });
            setShowLoader(false)
            setFormData({
              name: "",
              email: "",
            });
          });

        }
      })
      .then((data) => {})
      .catch(() => {
        setShowLoader(false)
      });
  };

  return (
    <div className="">
    <div className="customer-signin-div-container">
      <div className="login-image-container">
        <img
          src="https://www.ascarii.com/hubfs/Optimised-Customer-Service-v4.png"
          className="Login-image"
          alt=""
        />
      </div>
      <div className="customer-signin-form-main-container">
        <center>
          <h2 className="customer-signin-form-heading-container">
            Add Customer
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
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
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
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
            <div className="customer-signin-form-group-container">
            <Button
              text="Register"
              type="Submit"
              style={{color:"#fff",backgroundColor:"#212d45"}}
              loading={showLoader}
              disabled={showLoader}
            />
            </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Customersignup;
