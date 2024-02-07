import React, { useEffect, useState } from "react";
import "./index.css";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../Spinner";
import DispatchButton from "./DispatchButton";
import EmptyOrder from "../EmptyOrder";
import { Box, Modal } from "@mui/material";
import CustomerInvoicePage from "../CustomerInvoicePage";
import CommonNavbar from "../CommonNavbar";
function Dispatch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products to display per page
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState();
  const [totalAmount, setTotalAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState(6);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const filtered = products.filter((product) => {
      const statusMatch =
        product.dispatch.invoice_status === invoiceStatusFilter.toString();
      const productIdMatch = product.dispatch.orders
        .toString()
        .includes(orderId);
      return productIdMatch && statusMatch;
    });

    setFilteredProducts(filtered);
  }, [products, orderId, invoiceStatusFilter, currentPage]);

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
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const role = sessionStorage.getItem("role");
  const fetchProducts = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(`${FETCH_URL}getdispatch`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } else {
        setTimeout(() => {
          setLoading(false);
          setProducts([]);
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setProducts([]);
      }, 3000);
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
    setDate(each.dispatch.data_time);
    setInvoiceId(each.dispatch.id);
    setSelectedOrders(each.dispatch.orders);
    setDiscount(each.dispatch.discount);
    setDiscountedAmount(each.dispatch.discounted_amount);
    setTotalAmount(each.dispatch.totalamount);
    setCustomerName(each.orders[0].customer_name);
    setModalOpen(true);
  };


  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const setStatus = (status, id) => {
    if (status === "5") {
      return (
        <p className="admin-order-accepted-quantity-sub-category">
          Invoice generated
        </p>
      );
    } else if (status === "6") {
      return (
        <p className="admin-order-accepted-quantity-sub-category">
          Invoice Accepted
        </p>
      );
    } else if (status === "7") {
      return (
        <p className="admin-order-accepted-quantity-sub-category">
          Invoice Rejected
        </p>
      );
    } else {
      return (
        <p className="admin-order-accepted-quantity-sub-category">
          Dispatched
          </p>
      );
    }
  };

  return (
    <>
      {role === "Dispatch" && <CommonNavbar />}
      {loading ? (
        <Spinner />
      ) : (
        <div className="admin-order-accepted-product-list">
          <h2 className="admin-order-accepted-order-list-heading">
            Dispatching Orders
          </h2>
          <div className="admin-order-accepted-search-filter-input-container">
            <input
              type="number"
              name="orderid"
              value={orderId}
              onChange={handleSearch}
              placeholder="Search by Order ID"
              required
              className="admin-order-accepted-search-filter-input"
            />
            <select
              value={invoiceStatusFilter}
              onChange={(e) => setInvoiceStatusFilter(e.target.value)}
              className="admin-order-accepted-search-filter-input"
            >
              <option value={5}>Invoice Generated</option>
              <option value={6}>Invoice Accepted</option>
              <option value={7}>Invoice Rejected</option>
              <option value={8}>Dispatched</option>
            </select>
          </div>
          <div className="admin-order-accepted-table-container">
            <div className="admin-order-accepted-category-types">
              <p className="admin-order-accepted-order-id-category">
                Order Id's
              </p>
              <p className="admin-order-accepted-order-id-category">
                custome Name
              </p>
              <p className="admin-order-accepted-order-id-category">
                Order Names
              </p>
              <p className="admin-order-accepted-order-id-category">
                Product Names
              </p>
              <p className="admin-order-accepted-name-category">Total Amount</p>
              <p className="admin-order-accepted-service-category">
                Discount(%)
              </p>
              <p className="admin-order-accepted-quantity-category">
                Final Amount
              </p>
              <p className="admin-order-accepted-accept-category">Status</p>
              <p className="admin-order-accepted-decline-category">Dispatch</p>
              <p className="admin-order-accepted-view-in-detail-category">
                View
              </p>
            </div>
            {filteredProducts.length > 0 ? (
              <>
                {currentProducts.map((eachProduct) => {
                  return (
                    <div
                      className="admin-order-accepted-display-of-products-container"
                      style={{ height: "max-content" }}
                    >
                      <p className="admin-order-accepted-order-id-sub-category">
                        {JSON.parse(eachProduct.dispatch.orders).join(", ")}
                      </p>
                      <p className="admin-order-accepted-order-id-sub-category">
                        {eachProduct.orders[0].customer_name}
                      </p>
                      <p className="admin-order-accepted-order-id-sub-category">
                        {eachProduct.orders.map((order, index) => (
                          <React.Fragment key={order.id}>
                            {order.name}
                            {index < eachProduct.orders.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                      <p className="admin-order-accepted-order-id-sub-category">
                        {eachProduct.orders.map((order, index) => (
                          <React.Fragment key={order.id}>
                            {order.product}
                            {index < eachProduct.orders.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                      <p className="admin-order-accepted-name-sub-category">
                        {eachProduct.dispatch.totalamount.toFixed(2)}
                      </p>
                      <p className="admin-order-accepted-service-sub-category">
                        {eachProduct.dispatch.discount.toFixed(2)}
                      </p>
                      <p className="admin-order-accepted-quantity-sub-category">
                        {eachProduct.dispatch.discounted_amount.toFixed(2)}
                      </p>
                      {setStatus(
                        eachProduct.dispatch.invoice_status,
                        eachProduct.dispatch.orders
                      )}

                      <DispatchButton
                        status={eachProduct.dispatch.invoice_status}
                        orderIds={eachProduct.dispatch.orders}
                        id={eachProduct.dispatch.id}
                        fetchProducts={fetchProducts}
                      />
                      <BsFillArrowRightCircleFill
                        id={eachProduct.dispatch.id}
                        value={eachProduct.dispatch.id}
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
            invoiceId={invoiceId}
            selectedOrders={selectedOrders}
            onClose={handleCloseModal}
            fetchProducts={fetchProducts}
            totalAmount={totalAmount}
            date={date}
            discount={discount}
            customerName={customerName}
            discountedAmount={discountedAmount}
          />
        </Box>
      </Modal>
    </>
  );
}

export default Dispatch;
