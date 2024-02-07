import Toast from "../utlis/toast";
import React, { useState } from "react";

const CustomerAddButton = (props) => {
const [status, setStatus] = useState("");

  const handleSubmit = async (id, id1) => {
    const requestData = {
      admin: id1,
    };
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}updateCustomerAdminById/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData), // Stringify the data
        }
      );

      if (response.ok) {
        const data = await response.json();
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        props.fetchProducts();
      } else {
      }
    } catch (error) {}
  };

  const onClickDecline = (e) => {
    setStatus(false);
    handleSubmit(e.target.value, false);
  };

  const onClickReceived = (e) => {
    setStatus(true);
    handleSubmit(e.target.value, true); // Set the status here
  };

  return (
    <>
      <button
        value={props.id}
        onClick={onClickReceived}
        className="admin-order-accepted-received-button"
      >
        Accept
      </button>
      <button
        value={props.id}
        onClick={onClickDecline}
        className="admin-order-accepted-declined-button"
      >
        Decline
      </button>
    </>
  );
};

export default CustomerAddButton;
