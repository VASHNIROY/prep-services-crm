import { useState } from "react";
import Toast from "../utlis/toast";

const AmountPost = ({ id, fetchProducts, setupdatepage }) => {
  const [amount1, setAmount] = useState();

  const onChangeInput = (e) => {
    setAmount(e.target.value);
  };
  const onSubmitFunction = (e) => {
    handeSubmit(e.target.id, amount1);
  };
  const handeSubmit = async (id, amount1) => {
    const role = sessionStorage.getItem("role");
    try {
      const amount2 = {
        amount: amount1,
      };
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}amountUpdate/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(amount2),
        }
      );

      if (response.ok) {
        response.json().then((data) => {
          // Store the token in sessionStorage
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        setAmount("");
        if (role === "Admin") {
          fetchProducts();
          setupdatepage("2");
        } else {
          fetchProducts();
          setupdatepage("2");
        }
      } else {
        response.json().then((data) => {
          // Store the token in sessionStorage
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div className="admin-order-accepted-enter-amount-input-container">
        <input
          className="admin-order-accepted-enter-amount-input-box"
          type="text"
          id={id}
          onChange={onChangeInput}
        />
      </div>
      <button
        onClick={onSubmitFunction}
        id={id}
        className="admin-order-accepted-received-button"
      >
        post
      </button>
    </>
  );
};

export default AmountPost;
