import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./sidebar";
import "./index.css";
import { useNavigate } from "react-router-dom";
import AdminHomePage from "../AdminHomePage";
import Customersignup from "../CustomerSignup";
import AccountOrders from "../AccountantPage";
import LabelOrders from "../labelOrders";
import StaffSignupPage from "../StaffRegistration";
import DimensionOrderList from "../DimensionOrders";
import OrderViewDetail from "../AdminDetailPage";
import StaffList from "../StaffList";
import CustomerList from "../CustomerList";
import { IoMdLogOut } from "react-icons/io";
import { ProductServiceList } from "../Services";
import Dispatch from "../Dispatch";
import CustomerPendingList from "../CustomerPending";
import Popup from "reactjs-popup";
import AdminProfileView from "../AdminProfileView";
 
function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [status, setStatus] = useState(1);
  const [orderId, setOrderId] = useState("");
  const showSidebar = () => setSidebar(!sidebar);
  const [prevStatus, setPrevStatus] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userDetatils, setUserDetails] = useState([]);
 
  const handleSidebarItemClick = async (id) => {
    setPrevStatus(status);
    await setSidebar(false);
    await setStatus(id);
  };
  useEffect(() => {
    handleSidebarItemClick(status);
    sessionStorage.setItem("status", status);
    sessionStorage.setItem("prevStatus", prevStatus);
  }, [status]);
 
  const navigate = useNavigate();
 
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("sname");
    sessionStorage.removeItem("prevStatus");
    sessionStorage.removeItem("status");
    navigate("/stafflogin");
  };
  const openDetailPageComponent = (id) => {
    if (id) {
      setPrevStatus(status);
      sessionStorage.setItem("prevStatus", status);
      setStatus(12);
      setOrderId(id);
    } else {
    }
  };

  const handleCloseClick=()=>{
    setIsPopupOpen(false)
  }

  const role = sessionStorage.getItem("role");
  const name = sessionStorage.getItem("sname");
  const activeToggle = sidebar ? "menu-bars toggle" : `menu-bars`;
  const REACT_APP_PDF_URL = process.env.REACT_APP_PDF_URL;
  const FETCH_URL = process.env.REACT_APP_FETCH_URL;
  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${FETCH_URL}getSpecificStaffDetails`, {
        method: "GET",
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.staff);
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
      <div className="navbar">
        <Link to="#" className={activeToggle}>
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
        <div className="navbar-logout-button-container">
          <p className="navbar-nav-item-name">{name}</p>
          <p className="navbar-nav-item-name">{role}</p>
          <Popup
            closeOnDocumentClick={false}
            open={isPopupOpen}
            onClose={handleCloseClick}
            contentStyle={{ width: "500px", padding: "20px" }}
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
            <AdminProfileView
              onClose={handleCloseClick}
              fetchProducts1={fetchProducts}
            />
          </Popup>
          <button className="navbar-logout-button" onClick={handleLogout}>
            Logout
          </button>
          <IoMdLogOut className="navbar-logout-button-icon" onClick={handleLogout}/>
        </div>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <AiIcons.AiOutlineClose className="toggle-icon" />
            </Link>
          </li>
          {SidebarData.map((item, index) => {
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
                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={`content-container ${sidebar ? "shifted" : ""}`}>
        {parseInt(status) === 1 ? (
          <AdminHomePage openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 2 ? (
          <Customersignup openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 3 ? (
          <StaffSignupPage openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 4 ? (
          <DimensionOrderList
            openDetailPageComponent={openDetailPageComponent}
          />
        ) : parseInt(status) === 5 ? (
          <LabelOrders openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 6 ? (
          <AccountOrders openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 7 ? (
          <StaffList openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 8 ? (
          <CustomerList openDetailPageComponent={openDetailPageComponent} />
        ) : parseInt(status) === 9 ? (
          <ProductServiceList />
        ) : parseInt(status) === 10 ? (
          <Dispatch />
        ): parseInt(status) === 11 ? (
          <CustomerPendingList />
        ) : (
          <OrderViewDetail orderId={orderId} setStatus={setStatus} />
        )}
      </div>
    </div>
  );
}
 
export default Navbar;