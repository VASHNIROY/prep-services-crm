import React, { useState } from "react";
import "./index.css";
import { ImCancelCircle } from "react-icons/im";
import Toast from "../utlis/toast";

const CustomerUpdatePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const updatePassword = async () => {
    const authToken = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}updatecustomerpassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            currentPassword: oldPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        onClose();
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
      }
    } catch (error) {
      alert("An error occurred while updating the password.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="customer-update-password-heading">Password Update</h2>
        <ImCancelCircle
          onClick={onClose}
          style={{
            fontSize: "24px",
            color: "#212d45",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        />
      </div>
      <div className="customer-update-password-main-container">
        <form className="customer-update-password-form-container">
          <div className="customer-update-password-input-container">
            <label
              htmlFor="oldPassword"
              className="customer-update-password-label-name"
            >
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              required
              className="customer-update-password-input-field"
              placeholder="Enter current password"
            />
          </div>
          <div className="customer-update-password-input-container">
            <label
              htmlFor="newPassword"
              className="customer-update-password-label-name"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              className="customer-update-password-input-field"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="button"
            onClick={updatePassword}
            className="customer-update-password-button"
          >
            Update Password
          </button>
        </form>
      </div>
    </>
  );
};

export default CustomerUpdatePassword;
