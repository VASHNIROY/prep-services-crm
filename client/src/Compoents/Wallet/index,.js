import React, { useEffect, useState } from "react";
import "./index.css";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import WalletAdd from "./WalletAdd";
import { Box, Modal } from "@mui/material";

function Wallet() {
  const [products, setProducts] = useState([]);
  const [productsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    const filtered = products.filter((product) => {
      if (invoiceStatusFilter === "all") {
        return products;
      } else {
        const statusMatch = product.type === invoiceStatusFilter;
        const productIdMatch =
          statusMatch && statusMatch.toString().includes(orderId);
        return productIdMatch || statusMatch;
      }
    });

    setFilteredProducts(filtered);
  }, [products, orderId, invoiceStatusFilter]);

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}gettransaction`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const NextButton =
    indexOfLastProduct >= filteredProducts.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleSearch = (e) => {
    setOrderId(e.target.value);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAmountAdd = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="admin-order-accepted-product-list">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="admin-order-accepted-order-list-heading">
            Transactions
          </h2>
          <button className="service-add-button" onClick={handleAmountAdd}>
            Top Up
          </button>
        </div>
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
            value={invoiceStatusFilter}
            onChange={(e) => setInvoiceStatusFilter(e.target.value)}
            className="admin-order-accepted-search-filter-input"
          >
            <option value="all">All</option>
            <option value="debit">Debited</option>
            <option value="credit">Credited</option>
          </select>
        </div>
        <div className="admin-order-accepted-table-container">
          <div
            className="admin-order-accepted-category-types"
            style={{ fontWeight: "600" }}
          >
            <p className="customer-list-table-row">Transaction Id</p>
            <p className="customer-list-table-row">Order IDs</p>
            <p className="customer-list-table-row">Amount</p>
            <p className="customer-list-table-row">Transaction Date</p>
            <p className="customer-list-table-row">Type</p>
          </div>

          {currentProducts.length > 0 ? (
            <>
              {currentProducts.map((eachProduct) => (
                <div
                  className="admin-order-accepted-display-of-products-container"
                  key={eachProduct.id}
                >
                  <p className="customer-list-table-row">{eachProduct.id}</p>
                  <p className="customer-list-table-row">
                    {eachProduct.order_ids &&
                      JSON.parse(eachProduct.order_ids).join(", ")}
                  </p>
                  <p className="customer-list-table-row">
                    {eachProduct.amount}
                  </p>

                  <p className="customer-list-table-row">
                    {new Date(
                      eachProduct.transaction_date
                    ).toLocaleDateString()}
                  </p>
                  <p
                    className={`customer-list-table-row ${
                      eachProduct.type === "debit"
                        ? "status-debit"
                        : "status-credit"
                    }`}
                  >
                    {eachProduct.type}
                  </p>
                </div>
              ))}
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
            <h4>No Transactions</h4>
          )}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        style={{ width: "100%" }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "300px",
            top: "50%",
            left: "50%",

            overflow: "scroll",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "8px",
            p: 3,
          }}
        >
          <WalletAdd onClose={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
}

export default Wallet;
