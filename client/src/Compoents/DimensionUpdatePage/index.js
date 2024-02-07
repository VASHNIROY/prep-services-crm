import React from "react";
import { useState, useEffect } from "react";
import DimensionsUpdate from "../DimensionsUpdate";
import Toast from "../utlis/toast";
import DimensionDetailPage from "../DimensionsDetailPage";
import "./index.css";
import { ImCancelCircle } from "react-icons/im";

function DimensionUpdatePage({
  updateId,
  fetchProducts,
  onClose,
}) {
  const [dimensionList, setDimensionList] = useState([]);
  const [addDimesions, setAddDimensions] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    productName: "",
    units: "",
    trackingURL: "",
    length: "",
    height: "",
    width: "",
    weight: "",
    instructions: "",
  });

  const id = updateId;
  const token = sessionStorage.getItem("token");
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${FETCH_URL}getAdminOrderDetails/${id}`, {
          method: "GET",
          headers: {
            Authorization: ` Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data1 = await response.json();
          const data = data1.order;
          setFormData({
            ...formData,
            customerName: data.name,
            productName: data.product,
            units: data.unit,
            trackingURL: data.tracking_url,
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight,
            instructions: data.instructions,
          });
        } else {
        }
      } catch (error) {}
    }

    fetchData();
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await fetch(`${FETCH_URL}/getdimensionbyid/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDimensionList(data.dimensions);
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchData1();
  }, []);

  const handleDimensions = () => {
    setAddDimensions(!addDimesions);
  };

  const handleDispatch = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to dispatch this to labelling team.."
    );

    if (!isConfirmed) {
      return;
    }
    const requestData = {
      status: 3,
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
        fetchProducts();
        onClose();
      } else {
        const data = await response.json();
      }
    } catch (error) {
    }
  };

  const handleModel = () => {
    onClose();
  };

  return (
    <div className="admin-order-accepted-product-list">
     <div className="model-close-icon-container">
      <ImCancelCircle className="model-close-icon" onClick={handleModel}/>
      </div>
      <div className="dimension-update-page-heading-flex">
        <h2 className="admin-order-accepted-order-list-heading">
          Dimensions Order List
        </h2>

        <div className="dimension-update-page-button-container">
          <button
            className="dimension-update-page-button"
            onClick={handleDimensions}
          >
            Add Dimensions
          </button>
          <button
            className="dimension-update-page-button"
            onClick={handleDispatch}
          >
            Dispatch
          </button>
        </div>
      </div>
      <div className="admin-order-accepted-table-container-1">
        <div className="admin-order-accepted-category-types">
          <p className="admin-order-accepted-order-id-category">Order Id</p>
          <p className="admin-order-accepted-name-category">Customer Name</p>

          <p className="admin-order-accepted-service-category">Product Name</p>
          <p className="admin-order-accepted-quantity-category">Quantity</p>
          <p className="admin-order-accepted-order-tracking-category">
            Order Tracking Link
          </p>
        </div>

        <div className="admin-order-accepted-display-of-products-container">
          <p className="admin-order-accepted-order-id-sub-category">
            {updateId}
          </p>
          <p className="admin-order-accepted-name-sub-category">
            {formData.customerName}
          </p>
          <p className="admin-order-accepted-service-sub-category">
            {formData.productName}
          </p>
          <p className="admin-order-accepted-quantity-sub-category">
            {formData.units}
          </p>
          <p className="admin-order-accepted-order-tracking-sub-category">
            {formData.trackingURL ? (
              <a
                href={formData.trackingURL}
                rel="noreferrer"
                target="_blank"
                className="tracking-url"
              >
                Order Link
              </a>
            ) : (
              <p className="" tracking_url></p>
            )}
          </p>
        </div>
      </div>
      {addDimesions && (
        <DimensionsUpdate
          id={updateId}
          fetchData1={fetchData1}
          handleDimensions={handleDimensions}
        />
      )}
      {dimensionList.length > 0 &&
        dimensionList.map((each, index) => (
          <DimensionDetailPage
            dimensionData={each}
            key={each.id}
            index={index}
            fetchData1={fetchData1}
          />
        ))}
    </div>
  );
}
export default DimensionUpdatePage;
