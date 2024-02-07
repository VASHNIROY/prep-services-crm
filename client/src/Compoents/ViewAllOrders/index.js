import React, { useEffect, useState } from "react";
import "../adminOrders/index.css";
import "./index.css";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import EmptyOrder from "../EmptyOrder";
import Spinner from "../Spinner";

function ViewAllOrders({ openDetailPageComponent }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const statusLabels = {
      0: "Pending",
      1: "Rejected",
      2: "Received",
      3: "Dimension",
      4: "Label",
      5: "Invoice Generated",
      6: "Invoice Accepted",
      7: "Invoice Rejected",
      8: "Dispatched",
    };

    // Filter products based on orderId and selected filter
    const filtered = products.filter((product) => {
      const productIdMatch = product.id.toString().includes(orderId);
      const productNameMatch = product.name.toLowerCase().includes(orderId);
      const matchesOrderId = productIdMatch || productNameMatch;

      const matchesFilter =
        selectedFilter === "" ||
        statusLabels[product.status] === selectedFilter;

      return matchesOrderId && matchesFilter;
    });

    setFilteredProducts(filtered);
  }, [products, orderId, currentPage, selectedFilter]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleSearch = (e) => {
    const { name, value } = e.target;
    if (name === "orderid") {
      setOrderId(value);
    } else if (name === "filter") {
      setSelectedFilter(value);
    }

    setCurrentPage(1); // Reset pagination when changing search filter
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${FETCH_URL}getOrders/${9}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data.results);
          setLoading(false);
        } else {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchProducts();
  }, []);;

  const NextButton =
    indexOfLastProduct >= filteredProducts.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  const statusLabels = {
    0: "Pending",
    1: "Rejected",
    2: "Received",
    3: "Dimension",
    4: "Label",
    5: "Invoice Generated",
    6: "Invoice Accepted",
    7: "Invoice Rejected",
    8: "Dispatched",
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="admin-order-accepted-product-list">
          <h2 className="admin-order-accepted-order-list-heading">
            All Orders
          </h2>
          <div className="admin-order-accepted-search-filter-input-container">
            <input
              type="text"
              name="orderid"
              value={orderId}
              onChange={handleSearch}
              placeholder="Search by Name / Order ID"
              required
              className="admin-order-accepted-search-filter-input"
            />
            <select
              name="filter"
              value={selectedFilter}
              onChange={handleSearch}
              className="admin-order-accepted-search-filter-input"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Received">Received</option>
              <option value="Dimension">Dimension</option>
              <option value="Label">Label</option>
              <option value="Invoice Generated">Invoice Generated</option>
              <option value="Invoice Accepted">Invoice Accepted</option>
              <option value="Invoice Rejected">Invoice Rejected</option>
              <option value="Dispatched">Dispatched</option>
            </select>
          </div>
          <div className="admin-order-accepted-table-container">
            <div className="admin-order-accepted-category-types">
              <p className="admin-order-accepted-order-id-category">Order Id</p>
              <p className="admin-order-accepted-name-category">
                Customer Name
              </p>
              <p className="admin-order-accepted-name-category">Order Name</p>
              <p className="admin-order-accepted-service-category">
                Product Name
              </p>
              <p className="admin-order-accepted-quantity-category">Quantity</p>
              <p className="admin-order-accepted-order-tracking-category">
                Order Tracking Link
              </p>
              <p className="admin-order-accepted-fnsku-category">Status</p>
              <p className="admin-order-accepted-fnsku-category">FNSKU</p>
              <p className="admin-order-accepted-box-label-category">
                Box Label
              </p>
              <p className="admin-order-accepted-view-in-detail-category">
                View In Detail
              </p>
            </div>

            {filteredProducts.length > 0 ? (
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
                          <p className="" tracking_url></p>
                        )}
                      </p>
                      <p
                        className={`admin-order-accepted-quantity-sub-category ${
                          eachProduct.status === "8"
                            ? "status-dispatced"
                            : eachProduct.status === "7"
                            ? "status-invoice-rejected"
                            : eachProduct.status === "6"
                            ? "status-invoice-accepted"
                            : eachProduct.status === "5"
                            ? "status-invoice-generated"
                            : eachProduct.status === "4"
                            ? "status-label"
                            : eachProduct.status === "3"
                            ? "status-dimension"
                            : eachProduct.status === "2"
                            ? "status-received"
                            : eachProduct.status === "1"
                            ? "status-rejected"
                            : eachProduct.status === "0"
                            ? "status-pending"
                            : ""
                        }`}
                      >
                        {statusLabels[eachProduct.status] || "Unknown Status"}
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

                      <BsFillArrowRightCircleFill
                        id={eachProduct.id}
                        value={eachProduct.id}
                        onClick={() => openDetailPageComponent(eachProduct.id)}
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
                    disabled={indexOfLastProduct >= filteredProducts.length}
                    className={NextButton}
                  />
                </div>
              </>
            ) : (
              <EmptyOrder />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ViewAllOrders;
