import React from "react";
import { useState, useEffect } from "react";
import "./index.css";

function Customerinvoicedata({ data, date }) {
  const eachProduct = data;
  const [service, setServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  let total = 0;
  useEffect(() => {
    setServices(data.services);
  }, [data]);

  const fetchTotalAmount = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return;
    }
    fetch(`${process.env.REACT_APP_FETCH_URL}getAmount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalAmount(data.total_amount);
      })
      .catch((error) => {
        setTotalAmount(0);
      });
  };

  useEffect(() => {
    fetchTotalAmount();
  }, []);

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <h4>Order Id : {eachProduct.id}</h4>
        <div className="generate-invoice-table-container-1">
          <div className="generate-invoice-header-table-container">
            <p className="generate-invoice-table-header">Invoice</p>
            <p className="generate-invoice-table-header">Date</p>
            <p className="generate-invoice-table-header">Order Name</p>
            <p className="generate-invoice-table-header">Order Quantity</p>
          </div>
          <div
            className="generate-invoice-table-display-container"
            key={eachProduct.id}
          >
            <p className="generate-invoice-table-header">{eachProduct.id}</p>
            <p className="generate-invoice-table-header">
              {new Date(date).toLocaleDateString()}
            </p>
            <p className="generate-invoice-table-header">{eachProduct.name}</p>
            <p className="generate-invoice-table-header">{eachProduct.unit}</p>
          </div>
        </div>
        <h5>Calculations</h5>
        <div className="generate-invoice-table-container-1">
          <div className="generate-invoice-header-table-container">
            <p className="generate-invoice-table-header">Activity</p>
            {/* <p className="generate-invoice-table-header">Category</p> */}
            <p className="generate-invoice-table-header">Quantity</p>
            <p className="generate-invoice-table-header">Rate</p>
            <p className="generate-invoice-table-header-1">Total</p>
          </div>
          {service.map((eachProduct) => {
            total =
              total +
              parseFloat(eachProduct.serviceQuantity) *
                parseFloat(eachProduct.productPrice);
            return (
              <div
                className="generate-invoice-table-display-container"
                key={eachProduct.serviceId}
              >
                <p className="generate-invoice-table-header">
                  {eachProduct.productName}
                </p>
                {/* <p className="generate-invoice-table-header">
                  {eachProduct.productCategory}
                </p> */}
                <p className="generate-invoice-table-header">
                  {eachProduct.serviceQuantity}
                </p>
                <p className="generate-invoice-table-header">
                  {eachProduct.productPrice}
                </p>
                <p className="generate-invoice-table-header-1">
                  {parseFloat(
                    eachProduct.serviceQuantity
                      ? (
                          parseFloat(eachProduct.serviceQuantity) *
                          parseFloat(eachProduct.productPrice)
                        ).toFixed(2)
                      : 0
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "12px",
          }}
        >
          <p className="generate-invoice-total-amount">
            Grand Total : {total ? total.toFixed(2) : 0}
          </p>
        </div>
      </div>
    </>
  );
}
export default Customerinvoicedata;
