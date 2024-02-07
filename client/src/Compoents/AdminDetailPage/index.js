import React, { useState, useEffect } from "react";
import "./index.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineFilePdf } from "react-icons/ai";
import Toast from "../utlis/toast";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import DimensionUpdatePage from "../DimensionUpdatePage";

function OrderViewDetail({ orderId, setStatus }) {
  const id = orderId;
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    service: "Prep Service",
    product: "",
    unit: "",
    tracking_url: "",
    fnskuSend: null,
    labelSend: null,
    fnskuSend1: null,
    labelSend1: null,
    status: "",
    instructions: "",
    quantity_received: "",
    status1: "",
  });
  const [fnskuSendFiles, setFnskuSendFiles] = useState([]);
  const [labelSendFiles, setLabelSendFiles] = useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const token = sessionStorage.getItem("token");

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

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
          name: data.name,
          service: data.service,
          product: data.product,
          unit: data.unit,
          tracking_url: data.tracking_url,
          fnskuSend1: fnskuFiles,
          labelSend1: labelFiles,
          fnskuSend: null,
          labelSend: null,
          status: data.status,
          instructions: data.instructions,
          quantity_received: data.quantity_received,
          status1: data.status,
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

    // Fetch services
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    const selectedProductsWithQuantity = Object.keys(productQuantities)
      .filter((productId) => selectedProducts.includes(parseInt(productId)))
      .map((productId) => ({
        id: parseInt(productId),
        quantity: Number(productQuantities[productId]) || 0,
      }));

    const formDataToSend = new FormData();
    formDataToSend.append("orderId", orderId);
    formDataToSend.append("date", date || "");
    formDataToSend.append("name", name || "");
    formDataToSend.append("service", service);
    formDataToSend.append("product", product || "");
    formDataToSend.append("unit", unit || "");
    formDataToSend.append("tracking_url", tracking_url || "");
    formDataToSend.append("status", status);
    formDataToSend.append("instructions", instructions);
    formDataToSend.append("quantity_received", quantity_received || 0);
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

    fetch(`${FETCH_URL}updateOrderDetails/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        Toast.fire({
          icon: "success",
          title: data.message,
        });
        fetchData();
        setFnskuSendFiles([]);
        setLabelSendFiles([]);
      })
      .catch((error) => {});
  };

  const PDF_URL = process.env.REACT_APP_PDF_URL;

  const openFileInNewTab = (fileURL) => {
    if (fileURL) {
      window.open(`${PDF_URL}${fileURL}`, "_blank");
    }
  };

  const handleFnskuSendChange = (e) => {
    const files = e.target.files;
    setFnskuSendFiles([...fnskuSendFiles, ...files]);
  };

  const handleLabelSendChange = (e) => {
    const files = e.target.files;
    setLabelSendFiles([...labelSendFiles, ...files]);
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
    status,
    instructions,
    status1,
    quantity_received,
  } = formData;

  const getQuantityById = (productId) => {
    return productQuantities[productId];
  };
  const handleQuantityChange = (productId, quantity) => {
    if (selectedProducts.includes(productId)) {
      const updatedQuantities = { ...productQuantities };
      updatedQuantities[productId] = quantity;
      setProductQuantities(updatedQuantities);
    } else {
      Toast.fire({
        icon: "error",
        title: "Select Checkbox first to update quantity.",
      });
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
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
        orderId: id,
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
  const handleBackClick = () => {
    const prevStatus = sessionStorage.getItem("prevStatus");
    setStatus(prevStatus);
    sessionStorage.setItem("status", prevStatus);
  };

  const handleDimensionUpdate = () => {
    setModalOpen(true);
  };
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
          <h1 className="order-customer-main-heading">Order</h1>
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
                className="order-customer-lable-container"
                type="text"
                name="name"
                value={name}
                readOnly={parseInt(status) >= 5 ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">
                Quantity Recieved
              </label>
              <input
                className="order-customer-lable-container"
                type="number"
                name="quantity_received"
                value={quantity_received}
                readOnly={parseInt(status) >= 5 ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <p
              className="order-customer-dimension-update-button-container"
              onClick={handleDimensionUpdate}
            >
              Update Dimensions
            </p>
          </div>
          <div className="order-customer-field2-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Service:</label>
              <select
                className="order-customer-lable-container"
                onChange={handleChange}
                required
                readOnly={parseInt(status) >= 5 ? true : false}
                value={service}
              >
                <option value="Prep Service">Prep Service</option>
              </select>
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Product Name:</label>
              <input
                className="order-customer-lable-container"
                type="text"
                name="product"
                value={product}
                readOnly={parseInt(status) >= 5 ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            {parseInt(status) < 5 ? (
              <>
                <div className="order-customer-input-feild">
                  <label className="order-customer-label-name">
                    FNSKU ({fnskuSendFiles.length} files selected):
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
                    Label ({labelSendFiles.length} files selected) :
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
            ) : null}
          </div>
          <div className="order-customer-field3-container">
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Unit:</label>
              <input
                className="order-customer-lable-container"
                type="number"
                name="unit"
                value={unit}
                readOnly={parseInt(status) >= 5 ? true : false}
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
                readOnly={parseInt(status) >= 5 ? true : false}
                onChange={handleChange}
              />
            </div>
            <div className="order-customer-input-feild">
              <label className="order-customer-label-name">Instructions</label>
              <input
                className="order-customer-lable-container"
                type="text"
                name="instructions"
                value={instructions}
                readOnly={parseInt(status) >= 5 ? true : false}
                onChange={handleChange}
              />
            </div>
            {parseInt(status1) < 5 ? (
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Status</label>
                <select
                  className="order-customer-lable-container"
                  type="text"
                  name="status"
                  value={status || "Unknown Status"}
                  onChange={handleChange}
                >
                  <option value="0">Pending</option>
                  <option value="1">Rejected</option>
                  <option value="2">Received</option>
                  <option value="3">Dimension Done</option>
                  <option value="4">Labelling Done</option>
                  {/* <option value="5">Invoice Generated</option>
                  <option value="6">Invoice Accepted</option>
                  <option value="7">Invoice Rejected</option>
                  <option value="8">Dispatched</option> */}
                </select>
              </div>
            ) : (
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Status</label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="status"
                  value={statusLabels[status] || "Unknown Status"}
                ></input>
              </div>
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
                    onChange={(e) => handleProductSelection(e, product.id)}
                    className="order-customer-input-checkbox"
                  />
                  <input
                    type="number"
                    id={`product-${product.id}`}
                    name={`product-${product.id}`}
                    readOnly={parseInt(status) >= 5 ? true : false}
                    value={getQuantityById(product.id)}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    placeholder="Enter Quantity"
                    className="order-customer-service-input"
                  />
                </div>
              ))}
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
                <MdDeleteOutline
                  key={each}
                  onClick={(e) => onClickDeleteFile(e, each.id)}
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
                <MdDeleteOutline
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
          <DimensionUpdatePage updateId={orderId} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
}

export default OrderViewDetail;
