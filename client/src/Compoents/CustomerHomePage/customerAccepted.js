import React, { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../Spinner";
import EmptyOrder from "../EmptyOrder";
import { Box, Modal } from "@mui/material";
import CustomerInvoicePage from "../CustomerInvoicePage";
function CustomerAccepted() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState();
  const [totalAmount, setTotalAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const filtered = products.filter((product) => {
      const productIdMatch = product.orders.toString().includes(orderId);
      return productIdMatch;
    });

    setFilteredProducts(filtered);
  }, [products, orderId, currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleSearch = (e) => {
    setOrderId(e.target.value);
    setCurrentPage(1); // Reset pagination when changing search filter
  };
  // Number of products to display per page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  const fetchProducts = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(
        `${FETCH_URL}invoicepending/${6}`,
        // Replace with your API endpoint
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const NextButton =
    indexOfLastProduct >= filteredProducts.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  const handleView = (each) => {
    setSelectedOrders(each.orders);
    setDiscount(each.discount);
    setDate(each.data_time);

    setDiscountedAmount(each.discounted_amount);
    setTotalAmount(each.totalamount);
    setCustomerName(sessionStorage.getItem("sname"));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="admin-order-accepted-product-list">
          <h2 className="admin-order-accepted-order-list-heading">
           Invoice Accepted / Dispatched
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
            <div className="admin-order-accepted-category-types">
              <p className="admin-order-accepted-order-id-category">
                Order Id's
              </p>
              <p className="admin-order-accepted-name-category">Total Amount</p>
            
              <p className="admin-order-accepted-quantity-category">
                Final Amount
              </p>
              <p className="admin-order-accepted-name-category">Status</p>

              <p className="admin-order-accepted-view-in-detail-category">
                View
              </p>
            </div>
            {filteredProducts.length > 0 ? (
              <>
                {currentProducts.map((eachProduct) => {
                  return (
                    <div className="admin-order-accepted-display-of-products-container">
                      <p className="admin-order-accepted-order-id-sub-category">
                        {JSON.parse(eachProduct.orders).join(", ")}
                      </p>
                      <p className="admin-order-accepted-name-sub-category">
                        {eachProduct.totalamount.toFixed(2)}
                      </p>
                      <p className="admin-order-accepted-quantity-sub-category">
                        {eachProduct.discounted_amount.toFixed(2)}
                      </p>
                      <p className="admin-order-accepted-quantity-sub-category">
                        {eachProduct.invoice_status=== "6" ? "Invoice Accepted" : "Dispatched"}
                      </p>

                      <BsFillArrowRightCircleFill
                        id={eachProduct.id}
                        value={eachProduct.id}
                        className="admin-order-accepted-view-in-detail-sub-category"
                        onClick={() => handleView(eachProduct)}
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
      )}
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
          <CustomerInvoicePage
            selectedOrders={selectedOrders}
            onClose={handleCloseModal}
            fetchProducts={fetchProducts}
            totalAmount={totalAmount}
            discount={discount}
            date={date}
            customerName={customerName}
            discountedAmount={discountedAmount}
          />
        </Box>
      </Modal>
    </>
  );
}

export default CustomerAccepted;
