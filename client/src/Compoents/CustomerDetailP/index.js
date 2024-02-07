import React, { useState, useEffect } from "react";
import "./index.css";
import Toast from "../utlis/toast";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineFilePdf } from "react-icons/ai";
import { IoArrowBackCircle } from "react-icons/io5";
import { Box, Modal } from "@mui/material";
import CustomerDimensionView from "../CustomerDimensionView";

function CustomerOrderViewDetail({ orderId, setStatus }) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    service: "Prep Service",
    product: "",
    unit: "",
    tracking_url: "",
    status: "",
    instructions: "",
    quantity_received: "",
  });
  const [fnskuSendFiles, setFnskuSendFiles] = useState([]);
  const [labelSendFiles, setLabelSendFiles] = useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  const statusLabels = {
    0: "Pending",
    1: "Rejected",
    2: "Received",
    3: "Dimension Done",
    4: "Labelling Done",
    5: "Invoice Generated",
    6: "Invoice Accepted",
    7: "Invoice Rejected",
    8: "Dispatched",
  };
  const token = sessionStorage.getItem("token");
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const PDF_URL = process.env.REACT_APP_PDF_URL;

  const handleProductSelection = (e, productId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
      const updatedQuantities = { ...productQuantities };
      updatedQuantities[productId] = 0;
      setProductQuantities(updatedQuantities);
    } else {
      const updatedProducts = selectedProducts.filter((id) => id !== productId);
      setSelectedProducts(updatedProducts);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${FETCH_URL}getCustomerDetailOrder/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Set the Content-Type to JSON
          },
        }
      );
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
          ...formData,
          date: data.date,
          name: data.name,
          service: data.service,
          product: data.product,
          unit: data.unit,
          tracking_url: data.tracking_url,
          fnskuSend1: fnskuFiles,
          labelSend1: labelFiles,
          status: data.status,
          instructions: data.instructions,
          quantity_received: data.quantity_received,
        });
      } else {
      }
    } catch (error) {}
  };
  useEffect(() => {
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
  }, [orderId]);

  const handleBackClick = () => {
    const prevStatus = sessionStorage.getItem("prevStatus");
    setStatus(prevStatus);
    sessionStorage.setItem("status", prevStatus);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFnskuSendChange = (e) => {
    const files = e.target.files;
    setFnskuSendFiles([...fnskuSendFiles, ...files]);
  };
  const handleLabelSendChange = (e) => {
    const files = e.target.files;
    setLabelSendFiles([...labelSendFiles, ...files]);
  };

  const getQuantityById = (productId) => {
    return productQuantities[productId] || 0;
  };

  const onClickDeleteFile = async (e, fileId) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const requestData = {
        orderId: orderId,
      };
      const response = await fetch(`${FETCH_URL}deleteFile/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "File deleted successfully.",
        });

        fetchData(); // Update your component state or UI as needed
      } else {
        const errorData = await response.json();
      }
    } catch (error) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProductsWithQuantity = Object.keys(productQuantities)
      .filter((productId) => selectedProducts.includes(parseInt(productId)))
      .map((productId) => ({
        id: parseInt(productId),
        quantity: Number(productQuantities[productId]) || 0,
      }));

    const formDataToSend = new FormData();
    formDataToSend.append("date", date);
    formDataToSend.append("name", name);
    formDataToSend.append("service", service);
    formDataToSend.append("product", product);
    formDataToSend.append("unit", unit);
    formDataToSend.append("tracking_url", tracking_url);
    formDataToSend.append("instructions", instructions);
    formDataToSend.append("orderId", orderId);
    fnskuSendFiles.forEach((file, index) => {
      formDataToSend.append(`fnskuSendFiles`, file);
    });

    formDataToSend.append(
      "selectedProducts",
      JSON.stringify(selectedProductsWithQuantity)
    );

    labelSendFiles.forEach((file, index) => {
      formDataToSend.append(`labelSendFiles`, file);
    });

    fetch(`${FETCH_URL}customerOrderDetail/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // Set the Content-Type to JSON
      },
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        setFnskuSendFiles([]);
        setLabelSendFiles([]);
        fetchData();
      })
      .catch((error) => {
        fetchData();
      });
  };

  const openFileInNewTab = (fileURL) => {
    if (fileURL) {
      window.open(`${PDF_URL}${fileURL}`, "_blank");
    }
  };

  const {
    date,
    name,
    service,
    product,
    unit,
    tracking_url,
    fnskuSend1,
    labelSend1,
    quantity_received,
    status,
    instructions,
  } = formData;

  const handleDimensionUpdate = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const readOnlyInput =
    status === "0"
      ? "order-customer-lable-container"
      : "order-customer-lable-container admin-order-accepted-readonly";

  return (
    <>
      <div className="order-customer-container">
        <button
          className="order-customer-backward-button"
          onClick={handleBackClick}
        >
          <IoArrowBackCircle className="order-customer-backward-icon" />
        </button>
        <center>
          <h1 className="order-customer-main-heading">Order In Detail</h1>
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
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Order Name:</label>
              <input
                className={readOnlyInput}
                type="text"
                name="name"
                value={name}
                readOnly={status === "0" ? false : true}
                onChange={handleChange}
                required
              />
            </div>
            {/* <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
                Received Quantity:
              </label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                name="receivedQuantity"
                value={quantity_received}
                onChange={handleChange}
                required
                readOnly
              />
            </div> */}
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
                Received Quantity
              </label>
              <input
                className="order-customer-lable-container admin-order-accepted-readonly"
                type="text"
                value={quantity_received ? quantity_received : 0}
                readOnly
              />
            </div>
          </div>
          <div className="order-customer-field2-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Service:</label>
              <select
                className="order-customer-lable-container"
                onChange={handleChange}
                required
                value={service}
              >
                <option value="Prep Service">Prep Service</option>
              </select>
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
                Product Name :
              </label>
              <input
                className={readOnlyInput}
                type="text"
                name="product"
                value={product}
                readOnly={status === "0" ? false : true}
                onChange={handleChange}
                required
              />
            </div>
            {parseInt(status) <= 3 && (
              <>
                <div className="order-customer-input-feild">
                  <label className="order-customer-label-name">
                    FNSKU Send:
                  </label>
                  <input
                    className="order-customer-lable-container order-customer-label-file"
                    type="file"
                    name="fnskuSend"
                    onChange={handleFnskuSendChange}
                    multiple
                  />
                </div>
                <div className="order-customer-input-feild">
                  <label className="order-customer-label-name">
                    Box Label Send:
                  </label>
                  <input
                    className="order-customer-lable-container order-customer-label-file"
                    type="file"
                    name="labelSend"
                    onChange={handleLabelSendChange}
                    multiple
                  />
                </div>
              </>
            )}
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
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) =>
                      status === "0"
                        ? handleProductSelection(e, product.id)
                        : null
                    }
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
              <label className="order-customer-label-name">Unit:</label>
              <input
                className={readOnlyInput}
                type="number"
                name="unit"
                value={unit}
                readOnly={status === "0" ? false : true}
                onChange={handleChange}
                required
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Tracking_url:</label>
              <input
                className="order-customer-lable-container"
                type="text"
                name="tracking_url"
                value={tracking_url}
                onChange={handleChange}
              />
            </div>

            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Instructions</label>
              <input
                className="order-customer-lable-container "
                type="text"
                name="instructions"
                value={instructions}
                onChange={handleChange}
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Status</label>
              <input
                className="order-customer-lable-container"
                type="text"
                value={statusLabels[status] || "Unknown Status"}
                onChange={handleChange}
              />
            </div>
            <p
              className="order-customer-dimension-update-button-container"
              onClick={handleDimensionUpdate}
            >
              See Dimensions
            </p>
          </div>
        </form>
        <p
          style={{ marginLeft: "30px", marginTop: "20px", fontWeight: "600" }}
          className="order-customer-label-name"
        >
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
                <MdDeleteOutline
                  style={{ cursor: "pointer" }}
                  key={each}
                  onClick={(e) => onClickDeleteFile(e, each.id)}
                />
              </div>
            ))}
          </div>
        )}
        <p
          style={{ marginLeft: "30px", marginTop: "10px", fontWeight: "600" }}
          className="order-customer-label-name"
        >
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
                <MdDeleteOutline
                  style={{ cursor: "pointer" }}
                  key={each}
                  onClick={(e) => onClickDeleteFile(e, each.id)}
                />
              </div>
            ))}
          </div>
        )}
        <center>
          <button
            onClick={handleSubmit}
            className="order-customer-button-container"
            type="button"
          >
            Submit
          </button>
        </center>
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
          <CustomerDimensionView
            updateId={orderId}
            onClose={handleCloseModal}
          />
        </Box>
      </Modal>
    </>
  );
}

export default CustomerOrderViewDetail;
