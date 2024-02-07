import React, { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
//import { AiFillCaretRight } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import EmptyOrder from "../EmptyOrder";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../Spinner";

import CustomerAddButton from "./CustomerAddButton";
function CustomerPendingList({ openDetailPageComponent }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [productsPerPage] = useState(10); // Number of products to display per page
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Filter products based on orderId
    const filtered = products.filter((product) => {
      const productIdMatch = product.id.toString().includes(orderId);
      const productNameMatch = product.name.toLowerCase().includes(orderId);
      return productIdMatch || productNameMatch;
    });

    setFilteredProducts(filtered);
  }, [products, orderId, currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}getCustomersByAdminAndOTP`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.customers);
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
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setOrderId(e.target.value);
    setCurrentPage(1); // Reset pagination when changing search filter
  };

  const NextButton =
    indexOfLastProduct >= filteredProducts.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="admin-order-accepted-product-list">
          <h2 className="admin-order-accepted-order-list-heading">
            Customer Requests Lists
          </h2>
          <input
            type="text"
            name="orderid"
            value={orderId}
            onChange={handleSearch}
            placeholder="Search by Name / Order ID"
            required
            className="admin-order-accepted-search-filter-input"
          />
          <div className="admin-order-accepted-table-container">
            <div
              className="admin-order-accepted-category-types"
              style={{ fontWeight: "600" }}
            >
              <p className="customer-list-table-row">Customer Name</p>
              <p className="customer-list-table-row" style={{ width: "30%" }}>
                Email
              </p>
              <p className="admin-order-accepted-accept-category">Accept</p>
              <p className="admin-order-accepted-accept-category">Decline</p>
            </div>
            {filteredProducts.length > 0 ? (
              <>
                {currentProducts.map((eachProduct) => {
                  return (
                    <div className="admin-order-accepted-display-of-products-container">
                      <p className="customer-list-table-row">
                        {eachProduct.name}
                      </p>
                      <p
                        className="customer-list-table-row"
                        style={{ width: "30%" }}
                      >
                        {eachProduct.email}
                      </p>

                      <CustomerAddButton
                        id={eachProduct.id}
                        unit={eachProduct.unit}
                        fetchProducts={fetchProducts}
                      />
                    </div>
                  );
                })}
                <div className="pagination-button-container">
                  <BsFillArrowLeftCircleFill
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage <= 1}
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
              <h3>No Customer Requests</h3>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerPendingList;
