import React, { useState, useEffect } from "react";
import "./index.css";
import Toast from "../utlis/toast";
import Button from "../Button";

const CustomerOrder = () => {
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [servicesReq, setServicesReq] = useState("Prep Service");
  const [productName, setProductName] = useState("");
  const [units, setUnits] = useState("");
  const [trackingURL, setTrackingURL] = useState("");
  const [fnskuSendFiles, setFnskuSendFiles] = useState([]);
  const [labelSendFiles, setLabelSendFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showLoader, setShowLoader] = useState(false);


  const handleProductSelection = (e, productId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      const updatedProducts = selectedProducts.filter((id) => id !== productId);
      setSelectedProducts(updatedProducts);
    }
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    fetch(`${FETCH_URL}customerdata`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch customer data");
        }
      })
      .then((data) => {
        setCustomerId(data.id);
      })
      .catch(() => {});

    // Fetch products
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
      .catch((error) => {
      });

    // Fetch services
   
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    setDate(formattedDate);
  }, [FETCH_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "customerName":
        setCustomerName(value);
        break;
      case "servicesReq":
        setServicesReq(value);
        break;
      case "productName":
        setProductName(value);
        break;
      case "units":
        setUnits(value);
        break;
      case "trackingURL":
        setTrackingURL(value);
        break;
      case "instructions":
        setInstructions(value);
        break;
      default:
        break;
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

  const handleSubmit = async (e) => {
    setShowLoader(true)
    e.preventDefault();
    const selectedProductsWithQuantity = selectedProducts.map((productId) => ({
      id: productId,
      quantity: 0,
    }));

  
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("date", date);
      formData.append("name", customerName);
      formData.append("service", servicesReq);
      formData.append("product", productName);
      formData.append("units", units);
      formData.append("tracking_url", trackingURL);

      // Append multiple files for fnskuSend
      fnskuSendFiles.forEach((file, index) => {
        formData.append(`fnskuSendFiles`, file);
      });

      labelSendFiles.forEach((file, index) => {
        formData.append(`labelSendFiles`, file);
      });

      formData.append("customer_id", customerId);
      formData.append("instructions", instructions);
      formData.append(
        "selectedProducts",
        JSON.stringify(selectedProductsWithQuantity)
      );
      const response = await fetch(`${FETCH_URL}customerorder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
          setShowLoader(false)
        });
        setProductName("");
        setUnits("");
        setTrackingURL("");
        setFnskuSendFiles([]);
        setLabelSendFiles([]);
        setInstructions("");
        setCustomerName("");
        setSelectedProducts([]);
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
        setShowLoader(false)
      }
    } catch (error) {
      setShowLoader(false)
    }
  };

  return (
    <>
      <div className="order-customer-container">
        <center>
          <h1 className="order-customer-main-heading">Post Order</h1>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="order-customer-from-container">
            <div className="order-customer-field1-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Date:</label>
                <input
                  className="order-customer-lable-container"
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
                  name="customerName"
                  value={customerName}
                  onChange={handleChange}
                  required
                />
              </div>
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
            </div>
            <div className="order-customer-field2-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Service Required:
                </label>
                <select
                  className="order-customer-lable-container"
                  name="servicesReq"
                  value={servicesReq}
                  onChange={handleChange}
                  required
                >
                  <option value="Prep Service">Prep Service</option>
                </select>
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Product Name:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="productName"
                  value={productName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Label ({labelSendFiles.length} files selected):
                </label>
                <input
                  className="order-customer-lable-container order-customer-label-file"
                  type="file"
                  name="labelSend"
                  onChange={handleLabelSendChange}
                  multiple
                />
              </div>
              <div className="order-customer-service-container">
                <label className="order-customer-service-name">
                  Products :
                </label>
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
                  </div>
                ))}
              </div>
            </div>
            <div className="order-customer-field3-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Units:</label>
                <input
                  className="order-customer-lable-container"
                  type="number"
                  name="units"
                  value={units}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Tracking URL:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="trackingURL"
                  value={trackingURL}
                  onChange={handleChange}
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Instructions:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="instructions"
                  value={instructions}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="order-customer-submit-button-container" >
            <div style={{width:"200px",textAlign:"center",marginTop:"10px"}}>
          <Button
              text="Submit"
              type="Submit"
              loading={showLoader}
              disabled={showLoader}
              
            />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerOrder;
