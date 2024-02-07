import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Toast from "../utlis/toast";
import "./index.css";
import signup from "../utlis/signup-img-2.png";

const CreatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email"); // Extract token from query parameters

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form data
    const validationErrors = {};
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(
        `${FETCH_URL}createpassword/${token}?email=${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        navigate("/");
        setFormData({
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {}
  };

  return (
    <div className="customer-create-password-main-container">
      <div className="customer-update-password-main-container">
        <div className="customer-create-password-container">
          <div className="login-image-container">
            <img src={signup} className="Login-image" alt="" />
          </div>
          <form
            onSubmit={handleSubmit}
            className="customer-update-password-form-container"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding: "30px",
              borderRadius: "10px",
              width: "320px",
            }}
          >
            <h2 className="customer-update-password-heading">
              Create Password
            </h2>
            <div className="customer-update-password-input-container">
              <label className="customer-update-password-label-name">
                Password:
              </label>
              <input
                type="password"
                name="password"
                className="customer-update-password-input-field"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create your Password"
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div className="customer-update-password-input-container">
              <label className="customer-update-password-label-name">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="customer-update-password-input-field"
                placeholder="Confirm your Password"
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            <button type="submit" className="customer-update-password-button">
              Create Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
