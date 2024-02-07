import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { CustomerNavbarData } from "./CustomerNavbar.js";
import "./index.css";
import axxpress from "../images/axxpress.png";

import { useNavigate } from "react-router-dom";
import CustomerHomePage from "../CustomerHomePage";
import CustomerAccepted from "../CustomerHomePage/customerAccepted.js";
import CustomerRejected from "../CustomerHomePage/customerRejected.js";
import CustomerAllProducts from "../CustomerHomePage/customerAllproducts.js";
import CustomerOrder from "../customerOrder/index.js";
import TransactionSummary from "./Amount.js";
import CustomerOrderViewDetail from "../CustomerDetailP/index.js";
import { IoMdLogOut } from "react-icons/io";
import Wallet from "../Wallet/index,.js";
import Popup from "reactjs-popup";
import CustomerProfileView from "../CustomerProfileView/index.js";

function CustomerNavbar({ totalAmount, fetchTotalAmount }) {
  const [sidebar, setSidebar] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [userDetatils, setUserDetails] = useState([]);
  const [status, setStatus] = useState(() => {
    const storedStatus = sessionStorage.getItem("status");
    if (storedStatus === "10") {
      return 8;
    } else if (storedStatus === "") {
      return 9;
    } else {
      return parseInt(storedStatus);
    }
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [prevStatus, setPrevStatus] = useState(null);
  const showSidebar = () => setSidebar(!sidebar);
  const REACT_APP_PDF_URL = process.env.REACT_APP_PDF_URL;
  const handleSidebarItemClick = async (id) => {
    setPrevStatus(status);
    await setSidebar(false);
    await setStatus(id);
  };
  useEffect(() => {
    fetchTotalAmount();
    handleSidebarItemClick(status);
    sessionStorage.setItem("status", status);
    sessionStorage.setItem("prevStatus", prevStatus);
  }, [status]);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("sname");
    sessionStorage.removeItem("prevStatus");
    sessionStorage.removeItem("status");
    navigate("/");
  };

  const name = sessionStorage.getItem("sname");
  const activeToggle = sidebar ? "menu-bars toggle" : `menu-bars`;

  const openDetailPage = (id) => {
    if (id) {
      setPrevStatus(status);
      sessionStorage.setItem("prevStatus", status);
      sessionStorage.setItem("status", 10);
      setStatus(10);
      setOrderId(id);
      // navigate(`/CustomerOrderViewDetail/${id}`);
    }
  };

  const handleCloseClick = () => {
    setIsPopupOpen(false);
  };

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}getspecificcustomerdetails`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.customer);
      } else {
        setUserDetails("");
      }
    } catch (error) {
      setUserDetails("");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="navbar-container">

      <div className={`navbar ${sidebar ? "shifted" : ""}`}>
        <Link to="#" className={activeToggle}>
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
        <div className="navbar-logout-button-container">
          <TransactionSummary totalAmount={totalAmount} />
          <p className="navbar-nav-item-name">{name}</p>

          <Popup
            closeOnDocumentClick={false}
            open={isPopupOpen}
            onClose={handleCloseClick}
            contentStyle={{ width: "360px", padding: "20px" }}
            trigger={
              <img
                src={`${REACT_APP_PDF_URL}${
                  userDetatils && userDetatils.profile
                }`}
                alt=""
                className="navbar-profile-image"
                onClick=""
              />
            }
            position="bottom right"
          >
            <CustomerProfileView
              onClose={handleCloseClick}
              fetchProducts1={fetchProducts}
            />
          </Popup>
          <button className="navbar-logout-button" onClick={handleLogout}>
            Logout
          </button>
          <IoMdLogOut
            className="navbar-logout-button-icon"
            onClick={handleLogout}
          />
        </div>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <div className=""></div>
            <Link to="#" className="menu-bars">
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {CustomerNavbarData.map((item, index) => {
            const activeClassName =
              status === item.id ? `active-nav-item nav-text a` : `nav-text`;
            const activeTabIcon =
              status === item.id ? `sidebar-icon-active` : `sidebar-icon`;
            return (
              <li
                key={index}
                className={activeClassName}
                onClick={() => handleSidebarItemClick(item.id)}
              >
                <span className={activeTabIcon}>{item.icon}</span>
                <span className=".span">{item.title}</span>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={`content-container ${sidebar ? "shifted" : ""}`}>
        {parseInt(status) === 5 ? (
          <CustomerHomePage
            fetchTotalAmount={fetchTotalAmount}
            openDetailPage={openDetailPage}
          />
        ) : parseInt(status) === 6 ? (
          <CustomerAccepted openDetailPage={openDetailPage} />
        ) : parseInt(status) === 7 ? (
          <CustomerRejected openDetailPage={openDetailPage} />
        ) : parseInt(status) === 8 ? (
          <CustomerAllProducts openDetailPage={openDetailPage} />
        ) : parseInt(status) === 10 ? (
          <CustomerOrderViewDetail
            prevStatus={prevStatus}
            orderId={orderId}
            setStatus={setStatus}
          />
        ) : parseInt(status) === 4 ? (
          <Wallet totalAmount={totalAmount} />
        ) : (
          <CustomerOrder />
        )}
      </div>
    </div>
  );
}

export default CustomerNavbar;
