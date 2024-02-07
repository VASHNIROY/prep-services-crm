import Toast from "../utlis/toast";
import React from "react";
import ReceivedQuantity from "../ReceivedQuantity";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const DisplayAdminButton = (props) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const handleSubmit = async (id, status, unit) => {
    // Create an object with the data you want to send
    const requestData = {
      status: status,
    };
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}adminUpdateOrderStatus/${id}`,
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
        const data = await response.json();
        Toast.fire({
          icon: "error",
          title: data.message,
        });
        props.fetchProducts();
      }
    } catch (error) {}
  };

  const onClickDecline = (e) => {
    const status = "1";
    handleSubmit(e.target.value, status);
  };

  const onClickReceived = (e) => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        value={props.id}
        onClick={onClickReceived}
        className="admin-order-accepted-received-button"
      >
        Received
      </button>
      <button
        value={props.id}
        onClick={onClickDecline}
        className="admin-order-accepted-declined-button"
      >
        Decline
      </button>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        style={{ width: "100%" }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "20%",
            top: "50%",
            left: "50%",
            height: "150px",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 3,
          }}
        >
          <ReceivedQuantity
            fetchProducts={props.fetchProducts}
            onClose={handleCloseModal}
            orderId={props.id}
            unit={props.unit}
          />
        </Box>
      </Modal>
    </>
  );
};

export default DisplayAdminButton;
