import React, { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import Toast from "../utlis/toast";

const AddAmountCustomer = ({ id, onClose }) => {
  const [amount, setAmount] = useState(0);
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAddAmount = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to add ${amount} amount?`
    );
  
    if (!isConfirmed) {
      return; // User canceled the operation
    }
  
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await fetch(`${FETCH_URL}addAmountTransaction/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        throw new Error("Failed to add amount");
      }
      const data = await response.json();
      Toast.fire({
        icon: "success",
        title: data.message,
      });
      onClose();
      // Handle success, if needed
    } catch (error) {
      // Handle the error, if needed
    }
  };
  
  return (
    <>
      <div className="model-close-icon-container">
      <ImCancelCircle className="model-close-icon" onClick={onClose}/>
      </div>
      <div className="customer-list-add-amount-container">
        <h1 className="customer-list-add-amount-heading">Enter Amount</h1>
        <input
          type="number"
          className="customer-list-add-amount-input"
          value={amount}
          onChange={handleInputChange}
        />
        <button
          onClick={handleAddAmount}
          className="customer-list-add-amount-button"
        >
          Add Amount
        </button>
      </div>
    </>
  );
};

export default AddAmountCustomer;
