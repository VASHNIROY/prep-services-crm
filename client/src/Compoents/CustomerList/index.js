import React, { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../Spinner";
import Toast from "../utlis/toast";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AddAmountCustomer from "./AddAmount";

function CustomerList() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [productsPerPage] = useState(10);
  const [orderId, setOrderId] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [amountId, setAmountId]= useState("",)
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}update-customer-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (response.ok) {
        // Handle success, maybe update the local state

        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        fetchProducts();

        // You may want to update the local state here if needed
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
      }
    } catch (error) {
    }
  };

  useEffect(() => {
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

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}customersList`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.staffMembers);
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
    setCurrentPage(1);
  };

  const NextButton =
    indexOfLastProduct >= filteredProducts.length
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;
  const previousButton =
    currentPage === 1
      ? `pagination-arrow-container disable-previous-next-button`
      : `pagination-arrow-container`;

  const onclickaddamount = (e) => {
    setAmountId(e.target.value);
    setModalOpen(true);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="admin-order-accepted-product-list">
          <h2 className="admin-order-accepted-order-list-heading">
            Customer List
          </h2>
          <input
            type="text"
            name="orderid"
            value={orderId}
            onChange={handleSearch}
            placeholder="Search by Name / Order ID"
            required
            className="admin-order-accepted-search-filter-input"
            style={{padding:"10px"}}
          />
          <div className="admin-order-accepted-table-container">
            <div className="admin-order-accepted-category-types" style={{fontWeight:"600"}}>
              <p className="customer-list-table-row" style={{width:"10%"}}>Customer Id</p>
              <p className="customer-list-table-row">Customer Name</p>
              <p className="customer-list-table-row" style={{width:"30%"}}>Email</p>
              <p className="customer-list-table-row">Enable / Disable</p>
              <p className="customer-list-table-row">Amount</p>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                {currentProducts.map((eachProduct) => {
                  return (
                    <div
                      className="admin-order-accepted-display-of-products-container"
                      key={eachProduct.id}
                    >
                      <p className="customer-list-table-row" style={{width:"10%"}}>
                        {eachProduct.id}
                      </p>
                      <p className="customer-list-table-row">
                        {eachProduct.name}
                      </p>
                      <p className="customer-list-table-row" style={{width:"30%"}}>
                        {eachProduct.email}
                      </p>
                      <div className="customer-list-table-row">
                        <input
                          type="checkbox"
                          className="customer-list-table-row-input"
                          checked={eachProduct.status === 1 ? true : false}
                          onChange={() =>
                            handleToggle(
                              eachProduct.id,
                              eachProduct.status === 1
                            )
                          }
                        />
                      </div>
                      <div className="customer-list-table-row">
                      <button value={eachProduct.id} onClick={onclickaddamount}  className="customer-list-amount-button">
                        Add
                      </button>
                      </div>
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
              <h5> No Customers</h5>
            )}
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
                height: "180px",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                borderRadius: "8px",
                p: 3,
              }}
            >
              <AddAmountCustomer id={amountId}  onClose={handleCloseModal} />
            </Box>
          </Modal>
        </div>
      )}
    </>
  );
}

export default CustomerList;
