import React, { useState, useEffect, useRef } from "react";
import Customerinvoicedata from "./customerinvoice";

import { ImCancelCircle } from "react-icons/im";
import Toast from "../utlis/toast";
import { useReactToPrint } from "react-to-print";
import Axlogo from "../utlis/Axlogo.png";

function CustomerInvoicePage({
  onClose,
  selectedOrders,
  totalAmount,
  discount,
  customerName,
  fetchProducts,
  date,
  invoiceId,
}) {
  const [invoiceOrders, setInvoiceOrders] = useState([]);
  const [discountValue, setDiscountValue] = useState(discount);
  const contentRef = useRef();

  const handleModel = () => {
    onClose();
  };

  const calculateFinalPrice = (amount, discountPercentage) => {
    const discountAmount = (amount * discountPercentage) / 100;
    const discountedPrice = amount - discountAmount;
    const roundedFinalPrice = Math.round(discountedPrice * 100) / 100; // Round to two decimal places
    return roundedFinalPrice.toFixed(2);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const token = sessionStorage.getItem("token");
  const fetchData = async () => {
    try {
      const response = await fetch(`${FETCH_URL}generateInvoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedIds: JSON.parse(selectedOrders) }),
      });
      const data = await response.json();
      if (response.ok) {
        setInvoiceOrders(data.orders);
      } else {
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      // Handle error
    }
  };

  const role = sessionStorage.getItem("role");
  const addDiscount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}updatediscount/${invoiceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discount: parseInt(discountValue) }),
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "Discount updated successfully!",
        });
        onClose();
        fetchProducts();
      } else {
        const data = await response.json();
        Toast.fire({
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <button
          className="service-add-button"
          style={{ margin: "0px" }}
          onClick={handlePrint}
        >
          Download PDF
        </button>
        <ImCancelCircle
          className="model-close-icon"
          style={{ margin: "0px" }}
          onClick={handleModel}
        />
      </div>
      <div ref={contentRef} style={{ padding: "20px 20px" }}>
        <h1 className="genearte-invoice-heading">Invoice</h1>
        <div className="generate-invoice-logo-address-container">
          <div className="ax-logo-container">
            <img src={Axlogo} alt="logo" className="ax-logo" />
          </div>
          <div className="genrate-invoice-address-container">
            <h1 className="generate-invoice-address-name-heading">Ax Xpress</h1>
            <p className="generate-invoice-address-name">6102 N Damen Ave</p>
            <p className="generate-invoice-address-name">
              Chicago, IL 60659 US
            </p>
            <p className="generate-invoice-address-name">+1 8723161144</p>
            <p className="generate-invoice-address-name">
              payments@axxpress.com
            </p>
          </div>
        </div>
        <h3 className="genearte-invoice-heading">
          Customer Name : {customerName}
        </h3>
        {invoiceOrders.map((each) => (
          <Customerinvoicedata key={each.id} data={each} date={date} />
        ))}
        <div className="generate-invoice-billing-container">
          <div className="generate-invoice-discount-container">
            <p className="generate-invoice-total-amount">Total Amount</p>
            <p className="generate-invoice-total-amount-text">
              {totalAmount.toFixed(2)}
            </p>
          </div>
          {role === "Admin" && (
            <div className="generate-invoice-discount-container">
              <p
                className="generate-invoice-total-amount"
                style={{ width: "140px" }}
              >
                Discount(%)
              </p>
              <input
                type="text"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                style={{
                  border: "0.5px solid #212d45",
                  outline: "none",
                  width: "30px",
                  textAlign: "center",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={addDiscount}
                className="service-add-button"
                style={{ margin: "0px" }}
              >
                Add
              </button>
            </div>
          )}
          {role !== "Admin" && discount > 0 && (
            <div className="generate-invoice-discount-container">
              <p className="generate-invoice-total-amount">Discount(%)</p>
              <p
                className="generate-invoice-total-amount-text"
                style={{ fontWeight: 700, color: "#212d45", fontSize: "20px" }}
              >
                {discount}
              </p>
            </div>
          )}

          <div className="generate-invoice-discount-container">
            <p
              className="generate-invoice-total-amount"
              style={{ fontWeight: 700, color: "#212d45", fontSize: "20px" }}
            >
              Final Price
            </p>
            <p
              className="generate-invoice-total-amount-text"
              style={{ fontWeight: 700, color: "#212d45", fontSize: "20px" }}
            >
              {calculateFinalPrice(totalAmount, discountValue)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerInvoicePage;
