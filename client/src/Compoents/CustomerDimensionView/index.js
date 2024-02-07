import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DimensionsUpdate from "../DimensionsUpdate";
import Toast from "../utlis/toast";
import DimensionDetailPage from "../DimensionsDetailPage";
import CustomerDimension from "../CustomerDimension";
import { ImCancelCircle } from "react-icons/im";

function CustomerDimensionView({
  openDetailPageComponent,
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
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role");
  

  const openDetailPage = (productId) => {
    if (role === "Admin") {
      openDetailPageComponent(productId);
    } else {
      navigate(`/viewDetailedorder/${productId}`);
    }
  };

  

  const id = updateId;
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;


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

 
  const handleModel=()=>{
    onClose()
  }

 


  return (
    <div className="admin-order-accepted-product-list">
      <div className="model-close-icon-container">
      <ImCancelCircle className="model-close-icon" onClick={handleModel}/>
      </div>
      <div className="dimension-update-page-heading-flex">
        <h2 className="admin-order-accepted-order-list-heading">
          Dimensions Order List 
        </h2>
      </div>
      {(role === "Customer" || role==="Label") &&
        dimensionList.length > 0 ?
        dimensionList.map((each, index) => (
          <CustomerDimension
            dimensionData={each}
            key={each.id}
            index={index}
            fetchData1={fetchData1}
          />
        )):"No Dimensions"}
    </div>
  );
}
export default CustomerDimensionView;
