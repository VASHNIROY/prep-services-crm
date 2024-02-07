import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProductList from "./Compoents/adminOrders";
import LabelOrders from "./Compoents/labelOrders";
import OrderViewDetail from "./Compoents/AdminDetailPage";
import DimensionOrderList from "./Compoents/DimensionOrders";
import AdminHomePage from "./Compoents/AdminHomePage";
import Navbar from "./Compoents/Navbar";
import AccountOrders from "./Compoents/AccountantPage";
import StaffSigninPage from "./Compoents/StaffLogin";
import CustomerHomePage from "./Compoents/CustomerHomePage";
import CustomerLogin from "./Compoents/CustomerLogin";
import ViewDetailedOrder from "./Compoents/ViewDetailedOrder";
import ProtectedRoute from "./Compoents/ProtectedRoute";
import CustomerNavbar from "./Compoents/CustomerNavbar";
import CustomerOrderViewDetail from "./Compoents/CustomerDetailP";
import CommonNavbar from "./Compoents/CommonNavbar";
import DimensionUpdatePage from "./Compoents/DimensionUpdatePage";
import NotFound from "./Compoents/NotFound";
import Dispatch from "./Compoents/Dispatch";
import DimensionNewDetailPage from "./Compoents/DimensionDetailPage";
import CustomerResetPasswordUpdate from "./Compoents/CustomerNavbar/CustomerResetPassword";
import Customersignup2 from "./Compoents/CustomerSignup/CustomerSignup2";
import CustomerForgotPassword from "./Compoents/CustomerNavbar/CustomerForgot";
import CustomerOtpVerification from "./Compoents/CustomerNavbar/CustomerOtp";
import CustomerOtpVerification2 from "./Compoents/CustomerNavbar/CustomerOtp2";
import CreatePassword from "./Compoents/CustomerCreatePassword";
import StaffForgotPassword from "./Compoents/StaffForgotPassword";
import AdminOtp from "./Compoents/AdminOtp";
import AdminResetPassword from "./Compoents/AdminResetPassword";
import SideBar from "./Compoents/StaffNavbar";
import CustomerSideBar from "./Compoents/CustomerSideBar";
import CreditCard from "./Compoents/CreditCard";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const role = sessionStorage.getItem("role");
  const [totalAmount, setTotalAmount] = useState(0);
  const token = sessionStorage.getItem("token");

  const fetchTotalAmount = () => {
    if (!token) {
      return;
    }
    fetch(`${process.env.REACT_APP_FETCH_URL}getAmount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalAmount(data.total_amount || 0);
      })
      .catch(() => {
        setTotalAmount(0);
      });
  };

  useEffect(() => {
    fetchTotalAmount();
  }, []);

  return (
    <Routes>
      <Route
        path="/CustomerOtpVerification"
        element={<CustomerOtpVerification />}
      />
      <Route path="/createpassword/:token" element={<CreatePassword />} />
      <Route
        path="/CustomerOtpVerification2"
        element={<CustomerOtpVerification2 />}
      />
      <Route path="/AdminOtp" element={<AdminOtp />} />
      <Route
        path="/CustomerForgotPassword"
        element={<CustomerForgotPassword />}
      />
      <Route path="/StaffForgotPassword" element={<StaffForgotPassword />} />
      <Route path="/signup" element={<Customersignup2 />} />
      <Route
        path="/CustomerResetPasswordUpdate"
        element={<CustomerResetPasswordUpdate />}
      />
      <Route path="/AdminResetPassword" element={<AdminResetPassword />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<CustomerLogin />} />
      <Route path="/stafflogin" element={<StaffSigninPage />} />
      <Route
        path="/stafforderdetailpage/:id"
        element={
          <ProtectedRoute allowedRoles={["Label", "Dimension"]}>
            <DimensionNewDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/CustomerOrderViewDetail/:id"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerOrderViewDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dispatch"
        element={
          <ProtectedRoute allowedRoles={["Accountant", "Dispatch"]}>
            <Dispatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountOrders"
        element={
          <ProtectedRoute allowedRoles={["Accountant", "Admin"]}>
            <AccountOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dimensionorders"
        element={
          <ProtectedRoute allowedRoles={["Dimension", "Admin"]}>
            <DimensionOrderList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dimensionupdate/:id"
        element={
          <ProtectedRoute allowedRoles={["Dimension", "Admin"]}>
            <DimensionUpdatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminViewDetail/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <OrderViewDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminOrders"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labelOrders"
        element={
          <ProtectedRoute allowedRoles={["Label", "Admin"]}>
            <LabelOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commonNavbar"
        element={
          <ProtectedRoute allowedRoles={["Label", "Accountant", "Dimension"]}>
            <CommonNavbar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <SideBar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminhomepage"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customerhomepage"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerHomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/viewDetailedorder/:id" element={<ViewDetailedOrder />} />
      <Route
        path="/customernavbar"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerSideBar
              totalAmount={totalAmount}
              fetchTotalAmount={fetchTotalAmount}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CreditCard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
