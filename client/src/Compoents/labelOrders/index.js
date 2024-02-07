import React, { useEffect, useState } from "react";
import "./index.css";
import LabelPost from "./labelPost";
import { useNavigate } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

import CommonNavbar from "../CommonNavbar";
import EmptyOrder from "../EmptyOrder";

function LabelOrders({ openDetailPageComponent }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products to display per page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const role = sessionStorage.getItem("role");

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}labelorderlist`, {
        method: "GET",
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
      } else {
        setProducts("");
      }
    } catch (error) {
      setProducts("");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  const openDetailPage = (productId) => {
    if (role === "Admin") {
      openDetailPageComponent(productId);
    } else {
      navigate(`/stafforderdetailpage/${productId}`);

    }
  };

  const NextButton =
    indexOfLastProduct >= products.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  return (
    <>
      {role === "Label" && <CommonNavbar />}
      <div className="admin-order-accepted-product-list">
        <h2 className="admin-order-accepted-order-list-heading">
          Label Orders List
        </h2>
        <div className="admin-order-accepted-table-container">
          <div className="admin-order-accepted-category-types">
            <p className="admin-order-accepted-order-id-category">Order Id</p>
            <p className="admin-order-accepted-name-category">Customer Name</p>
            <p className="admin-order-accepted-name-category">Order Name</p>
            <p className="admin-order-accepted-service-category">
              Product Name
            </p>
            <p className="admin-order-accepted-quantity-category">Quantity</p>
            <p className="admin-order-accepted-order-tracking-category">
              Order Tracking Link
            </p>
            <p className="admin-order-accepted-fnsku-category">FNSKU Status</p>
            <p className="admin-order-accepted-box-label-category">Box Label</p>
            <p className="admin-order-accepted-fnsku-category">Label Done</p>
            <p className="admin-order-accepted-view-in-detail-category">
              Update
            </p>
            <p className="admin-order-accepted-view-in-detail-category">
              View Detail
            </p>
          </div>
          {products.length > 0 ? (
            <>
              {currentProducts.map((eachProduct) => {
                return (
                  <div className="admin-order-accepted-display-of-products-container">
                    <p className="admin-order-accepted-order-id-sub-category">
                      {eachProduct.id}
                    </p>
                    <p className="admin-order-accepted-name-sub-category">
                      {eachProduct.customer_name}
                    </p>
                    <p className="admin-order-accepted-name-sub-category">
                      {eachProduct.name}
                    </p>
                    <p className="admin-order-accepted-service-sub-category">
                      {eachProduct.product}
                    </p>
                    <p className="admin-order-accepted-quantity-sub-category">
                      {eachProduct.unit}
                    </p>
                    <p className="admin-order-accepted-order-tracking-sub-category">
                      {eachProduct.tracking_url ? (
                        <a
                          href={eachProduct.tracking_url}
                          rel="noreferrer"
                          target="_blank"
                          className="tracking-url"
                        >
                          Order Link
                        </a>
                      ) : (
                        " "
                      )}
                    </p>
                    <div className="admin-order-accepted-fnsku-sub-category">
                        <input
                          type="checkbox"
                          checked={
                            eachProduct.fnsku_status === 1 ? true : false
                          }
                          className="admin-order-accepted-checkbox"
                        />
                      </div>
                      <div className="admin-order-accepted-box-label-sub-category">
                        <input
                          type="checkbox"
                          checked={
                            eachProduct.label_status === 1 ? true : false
                          }
                          className="admin-order-accepted-checkbox"
                        />
                      </div>
                    <LabelPost
                      id={eachProduct.id}
                      fetchProducts={fetchProducts}
                    />
                    <BsFillArrowRightCircleFill
                      id={eachProduct.id}
                      value={eachProduct.id}
                      onClick={(e) => openDetailPage(eachProduct.id)}
                      className="admin-order-accepted-view-in-detail-sub-category"
                    />
                  </div>
                );
              })}
              <div className="pagination-button-container">
                <BsFillArrowLeftCircleFill
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={previousButton}
                />
                <span>Page {currentPage}</span>
                <BsFillArrowRightCircleFill
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastProduct >= products.length}
                  className={NextButton}
                />
              </div>
            </>
          ) : (
            <EmptyOrder />
          )}
        </div>
      </div>
    </>
  );
}
export default LabelOrders;
