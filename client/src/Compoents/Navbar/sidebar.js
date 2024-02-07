import React from "react";
import { BsFillPersonFill } from "react-icons/bs";
import {
  MdProductionQuantityLimits,
  MdOutlinePinch,
  MdLabelImportant,
  MdPeopleAlt,
  MdOutlinePeopleAlt,
} from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { IoPaperPlane } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import AdminHomePage from "../AdminHomePage";
import Customersignup from "../CustomerSignup";
import StaffSignupPage from "../StaffRegistration";
import DimensionOrderList from "../DimensionOrders";
import LabelOrders from "../labelOrders";
import AccountOrders from "../AccountantPage";
import StaffList from "../StaffList";
import CustomerList from "../CustomerList";
import { ProductServiceList } from "../Services";
import Dispatch from "../Dispatch";
import CustomerPendingList from "../CustomerPending";
import { IoIosNotifications } from "react-icons/io";
import { FaListAlt } from "react-icons/fa";
export const SidebarData = [
  {
    id: 1,
    title: "Receiving",
    path: "/",
    icon: <MdProductionQuantityLimits fontSize="25px" />,
    cName: "active-nav-item",
    component: <AdminHomePage />,
  },
  {
    id: 4,
    title: "Dimensions",
    path: "/messages",
    icon: <MdOutlinePinch fontSize="25px" />,
    cName: "",
    component: <DimensionOrderList />,
  },
  {
    id: 5,
    title: "Label Orders",
    path: "/support",
    icon: <MdLabelImportant fontSize="25px" />,
    cName: "",
    component: <LabelOrders />,
  },
  {
    id: 6,
    title: "Accountant",
    path: "/support",
    icon: <RiAccountCircleFill fontSize="25px" />,
    cName: "",
    component: <AccountOrders />,
  },
  {
    id: 10,
    title: "Dispatch",
    path: "/support",
    icon: <IoPaperPlane fontSize="20px" />,
    cName: "",
    component: <Dispatch />,
  },
  {
    id: 2,
    title: "Add Customer",
    path: "/Customersignup",
    icon: <BsFillPersonFill fontSize="25px" />,
    cName: "",
    component: <Customersignup />,
  },
  {
    id: 8,
    title: "Customers List",
    path: "/Customersignup",
    icon: <MdPeopleAlt fontSize="25px" />,
    cName: "",
    component: <CustomerList />,
  },
  {
    id: 3,
    title: "Add Staff",
    path: "/staffsignup",
    icon: <AiOutlineTeam fontSize="25px" />,
    cName: "",
    component: <StaffSignupPage />,
  },
  {
    id: 7,
    title: "Staff List",
    path: "/stafflist",
    icon: <MdOutlinePeopleAlt fontSize="25px"/>,
    cName: "nav-text",
    component: <StaffList />,
  },

  {
    id: 9,
    title: "Product & Services ",
    path: "/support",
    icon: <FaListAlt fontSize="20px" />,
    cName: "",
    component: <ProductServiceList />,
  },{
    id: 11,
    title: "Customer Requests",
    path: "/support",
    icon: <IoIosNotifications fontSize="25px" />,
    cName: "",
    component: <CustomerPendingList />,
  },
];
