import React, { useEffect, useState } from "react";
import Toast from "../utlis/toast";
import "./index.css";
const ProductServiceEdit = ({ fetchProductServices, id, onClose }) => {
  const [formData, setFormData] = useState({
    category: "Product",
    name: "",
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token"); // Assuming token is stored in sessionStorage
    try {
      const response = await fetch(`${FETCH_URL}product-service/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // You should include your authorization token here
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product/service");
      }

      const data = await response.json();
      Toast.fire({
        icon: "success",
        title: data.message,
      });
      setFormData({
        category: "Product",
        name: "",
        price: 0,
      });
      fetchProductServices();
      onClose();
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const api = `${FETCH_URL}product-service/${id}`;
      try {
        const response = await fetch(api, options);
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          category: data.data.category,
          name: data.data.name,
          price: data.data.price,
        });
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <div className="product-service-main-container">
      <form onSubmit={handleSubmit} className="product-service-form-container">
        <div className="product-service-input-container">
          <label htmlFor="category" className="product-service-label-name">
            Product and Services:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="product-service-input-field"
          >
            <option value="Product">Product</option>
            <option value="Service">Service</option>
          </select>
        </div>
        <div className="product-service-input-container">
          <label htmlFor="name" className="product-service-label-name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="product-service-input-field"
            placeholder="Enter Name"
          />
        </div>
        <div className="product-service-input-container">
          <label htmlFor="price" className="product-service-label-name">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            readOnly
            className="product-service-input-field"
          />
        </div>
        <button type="submit" className="service-add-button">
          Update
        </button>
      </form>
    </div>
  );
};
export default ProductServiceEdit;
