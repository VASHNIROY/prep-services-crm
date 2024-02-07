import React, { useState } from "react";
import "./CustomerResetPassword.css";
import Toast from "../utlis/toast";
import { useNavigate } from "react-router";
import signup from "../utlis/signup-img-2.png";

const CustomerResetPasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const navigate = useNavigate();

  const updatePassword = async () => {
    try {
      if (password !== confirmPassword) {
        Toast.fire({
          icon: "error",
          title:
            "Passwords do not match. Please make sure both passwords are the same.",
        });

        return;
      }

      const email = localStorage.getItem("email");

      const response = await fetch(`${FETCH_URL}resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        localStorage.removeItem("email");
        navigate("/");
      } else {
        const data = await response.json();
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      alert("An error occurred while updating the password.");
    }
  };

  return (
    <div className="update-password-background-container">
      <div className="update-password-main-container">
        <div className="login-image-container">
          <img src={signup} className="Login-image" alt="" />
        </div>
        <div className="update-password-sub-container">
          <h2 className="update-password-heading"> Reset Password</h2>
          <form>
            <label
              htmlFor="oldPassword"
              className="update-password-lable-container"
            >
              New Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={password}
              onChange={handlePasswordChange}
              required
              placeholder="Enter New Password"
              className="update-password-input-container"
            />
            <label
              htmlFor="newPassword"
              className="update-password-lable-container"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="update-password-input-container"
            />

            <button
              type="button"
              onClick={updatePassword}
              className="update-password-button"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerResetPasswordUpdate;
