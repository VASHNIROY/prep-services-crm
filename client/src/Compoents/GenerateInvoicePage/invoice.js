import React from "react";
import { useState, useEffect } from "react";

function Invoice({ data }) {
  const eachProduct = data;
  const [service, setServices] = useState([]);
  let total = 0;
  useEffect(() => {
    setServices(data.services);
  }, [data]);

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <h3>Each Product Invoice</h3>
        <div className="generate-invoice-table-container-1">
          <div className="generate-invoice-header-table-container">
            <p className="generate-invoice-table-header">Order ID</p>
            <p className="generate-invoice-table-header">Order Name</p>
            <p className="generate-invoice-table-header">Product Name</p>
            <p className="generate-invoice-table-header">Quantity</p>
          </div>
          <div
            className="generate-invoice-table-display-container"
            key={eachProduct.id}
          >
            <p className="generate-invoice-table-header">{eachProduct.id}</p>
            <p className="generate-invoice-table-header">{eachProduct.name}</p>
            <p className="generate-invoice-table-header">
              {eachProduct.product}
            </p>
            <p className="generate-invoice-table-header">{eachProduct.unit}</p>
          </div>
        </div>
        <h5>Calculations</h5>
        <div className="generate-invoice-table-container-1">
          <div className="generate-invoice-header-table-container">
            <p className="generate-invoice-table-header">Activity</p>

            {/* <p className="generate-invoice-table-header">Category</p> */}
            <p className="generate-invoice-table-header">Quantity</p>
            <p className="generate-invoice-table-header">Price</p>
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
            marginRight: "10px",
          }}
        >
          <p
            className="generate-invoice-total-amount"
            style={{ textAlign: "center" }}
          >
            Grand Total : {total ? total.toFixed(2) : 0}
          </p>
        </div>
      </div>
    </>
  );
}
export default Invoice;
