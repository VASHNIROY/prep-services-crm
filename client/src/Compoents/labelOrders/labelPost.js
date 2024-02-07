import { useState } from "react";
import Toast from "../utlis/toast";
const LabelPost = ({ id,fetchProducts,setupdatepage }) => {
  const [product, setProduct] = useState(false);

  const handeSubmit = async (id, product1) => {
    try {
      const labelstatus = {
        status: product1,
      };
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_FETCH_URL}updatelabelorder/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(labelstatus),
        }
      );

      if (response.ok) {
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          })})
          fetchProducts()
          setProduct(false)
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          })})
          fetchProducts()
      }
    } catch  {
    }
  };
  const onChangeCheckBox = () => {
    setProduct(!product);
  };

  const onClickSubmit = (e) => {
    handeSubmit(e.target.value, product);
  };
  return (
    <>
      <div className="admin-order-accepted-fnsku-sub-category">
        <input
          type="checkbox"
          id="myCheckbox"
          name="myCheckbox"
          onChange={onChangeCheckBox}
          checked={product}
          value="checkValue"
          className="admin-order-accepted-checkbox"
        />
      </div>
      <button
        value={id}
        onClick={onClickSubmit}
        className="admin-order-accepted-received-button"
      >
        update
      </button>
    </>
  );
};

export default LabelPost;
