import React, { useState, useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import "./index.css";
import { countriesCode } from "../Countries";
import Toast from "../utlis/toast";
function CustomerProfileEdit({ onClose, fetchProducts, fetchProducts1 }) {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const token = sessionStorage.getItem("token");
  const [selectedCountry, setSelectedCountry] = useState("");
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const fetchCustomerData = async () => {
    try {
      const response = await fetch(`${FETCH_URL}getspecificcustomerdetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const customerData = await response.json();
        setName(customerData.customer.name);
        setSelectedCountry(customerData.customer.mobile_number.split(" ")[0]);
        setMobileNumber(customerData.customer.mobile_number.split(" ")[1]);
       setAddress(customerData.customer.Address);
      } else {
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    const combinedMobile = `${selectedCountry} ${mobileNumber}`;
    formData.append("mobile_number", combinedMobile);formData.append("Address", address);
    if (profilePic) {
      formData.append("profile", profilePic);
    }

    try {
      const response = await fetch(`${FETCH_URL}updatespecificcustomer`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        Toast.fire({
          icon: "success",
          title:"Profile updated successfully",
        });
        fetchCustomerData();
        onClose();
        fetchProducts();
        fetchProducts1();
      } else {
      }
    } catch (error) {
    }
  };


  return (
    <>
    <div style={{display:"flex",justifyContent:"space-between"}}>
    <h1 className="customer-profile-edit-heading">Update Profile</h1>
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
      <div className="customer-profile-edit-main-container">
        <div className="customer-profile-edit-sub-container">
          
          <div className="customer-profile-edit-input-container">
            <label className="customer-profile-edit-name">Name</label>
            <input
              type="text"
              name="name"
              className="customer-profile-edit-input-field"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="customer-profile-edit-input-container">
            <div>
              <label htmlFor="country">Mobile No</label>
              <div className="customer-country-code">
              <select
                id="country"
                required
                value={selectedCountry}
                onChange={handleCountryChange}
                className="customer-profile-edit-input-field-select"
              >
                <option value="">Country code</option>
                {countriesCode.map((country) => (
                  <option key={country.code} value={country.dial_code}>
                    ({country.dial_code}) {country.name} 
                  </option>
                ))}
              </select>
           
              <input
                type="number"
                name="number"
                className="customer-profile-edit-input-field"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => {
                  const inputNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(inputNumber);
                }} 
                />
                  </div>
            </div>
          </div>
          <div className="customer-profile-edit-input-container">
            <label className="customer-profile-edit-name">Address</label>
            <input
              type="text"
              name="address"
              className="customer-profile-edit-input-field"
              placeholder="Enter your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="customer-profile-edit-input-container">
            <label className="customer-profile-edit-name">Profile Pic</label>
            <input
              type="file"
              className="customer-profile-edit-file"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </div>
          <button
            className="customer-profile-edit-button"
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default CustomerProfileEdit;
