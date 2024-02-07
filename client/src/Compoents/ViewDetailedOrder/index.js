import React, { useState, useEffect } from "react";
import "./index.css";
import { useParams, useNavigate } from "react-router-dom";
import CommonNavbar from "../CommonNavbar";
import { AiOutlineFilePdf } from "react-icons/ai";
import CustomerDimensionView from "../CustomerDimensionView";
import { Box, Modal } from "@mui/material";
import { IoArrowBackCircle } from "react-icons/io5";

function ViewDetailedOrder({ setStatus }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    date: "",
    customerName: "",
    servicesReq: "Prep Service",
    productName: "",
    unit: "",
    trackingURL: "",
    fnskuSend: null,
    labelSend: null,
    fnskuSend1: null,
    labelSend1: null,
    status: "",
   quantity_received: "",
    instructions: "",
  });
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [isModalOpen, setModalOpen] = React.useState(false);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const PDF_URL = process.env.REACT_APP_PDF_URL;
 
  const getQuantityById = (productId) => {
    return productQuantities[productId];
  };
 

  const fetchData = async () => {
    try {
      const response = await fetch(`${FETCH_URL}getAdminOrderDetails/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data1 = await response.json();
        const data = data1.order;
        const fnskuFiles =
          data1.files.filter((file) => file.type === "fnskuSend") || [];

        const labelFiles =
          data1.files.filter((file) => file.type === "labelSend") || [];

        data1.services.Products.forEach((item) => {
          productQuantities[item.services] = item.quantity;
        });

        const fetchedSelectedProducts = data1.services.Products.map(
          (productService) => productService.services
        );
        setSelectedProducts(fetchedSelectedProducts);


        setFormData({
          date: data.date,
          customerName: data.customer_name,
          service: data.service,
          productName: data.product,
          unit: data.unit,
          trackingURL: data.tracking_url,
          fnskuSend1: fnskuFiles,
          labelSend1: labelFiles,
          fnskuSend: null,
          labelSend: null,
          status: data.status,
          instructions: data.instructions,
          quantity_received: data.quantity_received,
        });
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Fetch data using the id passed as a prop
    fetch(`${FETCH_URL}getprep-productlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((productsResponse) => {
        if (productsResponse.ok) {
          return productsResponse.json();
        } else {
          throw new Error("Failed to fetch products");
        }
      })
      .then((productsData) => {
        setProducts(productsData.products);
      })
      .catch((error) => {});


    fetchData();
  }, [id]);

  const openFileInNewTab = (fileURL) => {
    if (fileURL) {
      window.open(`${PDF_URL}${fileURL}`, "_blank");
    }
  };

  const {
    date,
    customerName,
    servicesReq,
    productName,
    unit,
    trackingURL,
    fnskuSend1,
    labelSend1,
    instructions,
    quantity_received
  } = formData;

  const handleDimensionUpdate = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (role === "Label") {
      navigate("/labelorders");
    } else if (role === "Dimension") {
      navigate("/dimensionorders");
    } else if (role === "Accountant") {
      navigate("/accountOrders");
    }
  };

  return (
    <>
      <CommonNavbar />
      <div className="order-customer-container">
        <button
          className="order-customer-backward-button"
          onClick={handleBackClick}
        >
          <IoArrowBackCircle className="order-customer-backward-icon" />
        </button>
        <center>
          <h1 className="order-customer-main-heading"> Order Details</h1>
        </center>
        <form className="order-customer-from-container">
          <div className="order-customer-field1-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Date:</label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="date"
                name="date"
                value={date}
                readOnly
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name ">
                Customer Name:
              </label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                name="customerName"
                value={customerName}
                readOnly
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
              Quantity Recieved
              </label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="number"
                name="quantity_received"
                value={quantity_received}
                required
              />
            </div>
            <p
              className="order-customer-dimension-update-button-container"
              onClick={handleDimensionUpdate}
            >
              See Dimensions
            </p>
           
          </div>
          <div className="order-customer-field2-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
                Services Required:
              </label>
              <select
                className="order-customer-lable-container admin-order-accepted-readonly"
                value={servicesReq}
                readOnly
              >
                <option value="Prep Service">Prep Service</option>
              </select>
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Product Name:</label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                name="productName"
                value={productName}
                readOnly
              />
            </div>
            <div className="order-customer-service-container">
              <label className="order-customer-service-name">Products :</label>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="order-customer-service-input-container"
                >
                  <label
                    htmlFor={`product-${product.id}`}
                    className="order-customer-label-name"
                  >
                    {product.name} :
                  </label>
                  <input
                    type="checkbox"
                    id={product.id}
                    name="selectedProducts"
                    value={product.id}
                    readOnly
                    checked={selectedProducts.includes(product.id)}
                    className="order-customer-input-checkbox"
                  />
                  <input
                    type="number"
                    id={`product-${product.id}`}
                    name={`product-${product.id}`}
                    value={getQuantityById(product.id)}
                   readOnly
                    placeholder="Enter Quantity"
                    className="order-customer-service-input"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="order-customer-field3-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Units:</label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="number"
                name="units"
                value={unit}
                readOnly
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Tracking URL:</label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                name="trackingURL"
                value={trackingURL}
                readOnly
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Instructions</label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                name="instructions"
                value={instructions}
                readOnly
              />
            </div>
          </div>
        </form>
        <p style={{ marginLeft: "30px" }} className="order-customer-label-name">
          Fnsku Files
        </p>
        {fnskuSend1 && (
          <div
            style={{ display: "flex", flexWrap: "wrap", marginLeft: "30px" }}
          >
            {fnskuSend1.map((each) => (
              <div style={{ display: "flex", margin: "20px" }}>
                <AiOutlineFilePdf
                  key={each} // Ensure to provide a unique key when mapping over elements
                  onClick={() => openFileInNewTab(each.name)}
                  className="viewpdf-button"
                />
              </div>
            ))}
          </div>
        )}
        <p style={{ marginLeft: "30px" }} className="order-customer-label-name">
          Label Files
        </p>
        {labelSend1 && (
          <div
            style={{ display: "flex", flexWrap: "wrap", marginLeft: "30px" }}
          >
            {labelSend1.map((each) => (
              <div style={{ display: "flex", margin: "20px" }}>
                <AiOutlineFilePdf
                  key={each} // Ensure to provide a unique key when mapping over elements
                  onClick={() => openFileInNewTab(each.name)}
                  className="viewpdf-button"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        style={{ width: "100%" }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "70%",
            top: "50%",
            left: "50%",
            height: "500px",
            overflow: "scroll",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 3,
          }}
        >
            <CustomerDimensionView updateId={id} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
}

export default ViewDetailedOrder;
