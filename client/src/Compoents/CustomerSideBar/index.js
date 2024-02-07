import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { BsFillBoxSeamFill, BsXOctagonFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoWalletSharp } from "react-icons/io5";
import CustomerHomePage from "../CustomerHomePage";
import CustomerAccepted from "../CustomerHomePage/customerAccepted.js";
import CustomerRejected from "../CustomerHomePage/customerRejected.js";
import CustomerAllProducts from "../CustomerHomePage/customerAllproducts.js";
import CustomerOrder from "../customerOrder/index.js";
import CustomerOrderViewDetail from "../CustomerDetailP/index.js";
import { FaClipboardList } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import Wallet from "../Wallet/index,.js";
import CustomerTopNavbar from "../CustomerTopBar/index.js";
import Banner from "../Banner/index.js";

function CustomerSideBar({ totalAmount, fetchTotalAmount }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
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
  const [prevStatus, setPrevStatus] = useState(null);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("sname");
    sessionStorage.removeItem("prevStatus");
    sessionStorage.removeItem("status");
    navigate("/");
  };

  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
  };

  const handleSidebarItemClick = async (id) => {
    setPrevStatus(status);
    await setStatus(id);
  };
  useEffect(() => {
    console.log("fetch called customer");
    fetchTotalAmount();
  }, []);

  useEffect(() => {
    fetchTotalAmount();
    handleSidebarItemClick(status);
    sessionStorage.setItem("status", status);
    sessionStorage.setItem("prevStatus", prevStatus);
  }, [status]);

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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        className="sidebar-container"
        collapsed={isCollapsed}
        collapsedWidth="60px"
        backgroundColor="#2884a1"
      >
        <Menu
          menuItemStyles={{
            button: {
              "&.active": {
                backgroundColor: "#13395e",
                color: "#b6c8d9",
              },
              background: "#2884a1",
              color: "#fff",
              // Default text color for menu items
              "&:hover": {
                backgroundColor: "#fff", // Background color on hover
                color: "#212d45", // Text color on hover
              },
            },
          }}
        >
          <div className="hamburger-icon">
            <GiHamburgerMenu
              style={{ color: "#fff" }}
              onMouseEnter={handleMouseEnter}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<ImUpload fontSize="20px" />}
            onClick={() => handleSidebarItemClick(9)}
            style={
              status === 9 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Post Order
          </MenuItem>
          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<FaClipboardList fontSize="24px" />}
            onClick={() => setStatus(8)}
            style={
              status === 8 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Orders
          </MenuItem>
          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<BsFillBoxSeamFill fontSize="20px" />}
            onClick={() => handleSidebarItemClick(5)}
            style={
              status === 5 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Invoice Pending
          </MenuItem>
          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<RiVerifiedBadgeFill fontSize="24px" />}
            onClick={() => handleSidebarItemClick(6)}
            style={
              status === 6 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Invoice Accepted / Dispatched
          </MenuItem>
          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<BsXOctagonFill fontSize="20px" />}
            onClick={() => handleSidebarItemClick(7)}
            style={
              status === 7 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Invoice Rejected
          </MenuItem>

          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<IoWalletSharp fontSize="20px" />}
            onClick={() => handleSidebarItemClick(4)}
            style={
              status === 4 ? { backgroundColor: "#fff", color: "#212d45" } : {}
            }
          >
            Wallet
          </MenuItem>

          <MenuItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            icon={<IoLogOut fontSize="24px" />}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </Menu>
        <div></div>
      </Sidebar>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          minHeight: "100vh",
        }}
      >
        <div>
          <Banner />
          <CustomerTopNavbar
            totalAmount={totalAmount}
            fetchTotalAmount={fetchTotalAmount}
          />
        </div>

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

export default CustomerSideBar;
