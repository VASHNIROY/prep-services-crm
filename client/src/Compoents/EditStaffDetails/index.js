import React, { useState, useEffect } from "react";
import "./index.css";
import Toast from "../utlis/toast";
import { ImCancelCircle } from "react-icons/im";

const EditStaffDetails = ({ staff, onClose, fetchProducts }) => {
  const staffId = staff;
  const id = staffId.id;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  useEffect(() => {
    // Fetch staff details when the component mounts
    getStaffDetails(staffId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getStaffDetails = (staffId) => {
    const token = sessionStorage.getItem("token");
    const url = `${process.env.REACT_APP_FETCH_URL}getStaffDetailsById/${id}`;
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch staff details");
        }
      })
      .then((data) => {
        const { name, email, role } = data.staff;
        setFormData({
          name: name,
          email: email,
          role: role,
        });
      })
      .catch((error) => {});
  };

  const updateStaffDetails = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const url = `${process.env.REACT_APP_FETCH_URL}updateStaffDetailsById/${id}`;

    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        onClose();
        if (response.ok) {
          return response.json();
          fetchProducts();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Failed to update staff details");
          });
        }
      })
      .then((data) => {
        fetchProducts();
        Toast.fire({
          icon: "success",
          title: data.message,
        });
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: error.message,
        });
      });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="customer-update-password-heading">Staff Edit</h2>
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
        <form
          className="customer-update-password-form-container"
          onSubmit={updateStaffDetails}
        >
          <div className="customer-update-password-input-container">
            <label
              htmlFor="oldPassword"
              className="customer-update-password-label-name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              Email
            </label>
            <input
              type="email"
              id="newPassword"
              value={formData.email}
              readOnly
              required
              className="customer-update-password-input-field"
              placeholder="Enter new password"
            />
          </div>
          <div className="customer-update-password-input-container">
            <label className="customer-update-password-label-name">Role</label>
            <select
              name="role"
              className="customer-update-password-input-field"
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
          <button type="submit" className="customer-update-password-button">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default EditStaffDetails;
