import React, { useState } from "react";
import "./index.css";
import Toast from "../utlis/toast";
const ReceivedQuantity = ({ orderId, unit, onClose, fetchProducts }) => {
  const [quantityReceived, setQuantityReceived] = useState("");
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const token = sessionStorage.getItem("token");
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${FETCH_URL}updateOrderQuantity/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity_received: quantityReceived,
            unit: unit,
          }),
        }
      );

      if (response.ok) {
        // Add any additional logic you want to perform after a successful update
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        onClose();
        fetchProducts();
      } else {
      }
    } catch (error) {}
  };

  return (
    <div className="received-quantity-main-container">
      <label className="received-quantity-label-name">Quantity Received:</label>
      <input
        type="text"
        placeholder="Enter the Quantity received"
        className="received-quantity-input-field"
        value={quantityReceived}
        onChange={(e) => setQuantityReceived(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="received-quantity-update-button"
      >
        Update Order
      </button>
    </div>
  );
};

export default ReceivedQuantity;
