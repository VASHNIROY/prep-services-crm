import React from "react";
import * as FaIcons from "react-icons/fa";
import { BsXOctagonFill, BsFillBoxSeamFill } from "react-icons/bs";
import { ImUpload } from "react-icons/im";
import { RiVerifiedBadgeFill } from "react-icons/ri";
// import AdminHomePage from '../AdminHomePage';
// import DimensionOrderList from '../DimensionOrders';
// import LabelOrders from '../labelOrders';
import Wallet from "../Wallet/index,";
import CustomerHomePage from "../CustomerHomePage";
import CustomerOrder from "../customerOrder";
export const CustomerNavbarData = [
  {
    title: "Post Order",
    id: 9,
    icon: <ImUpload />,
    cName: "nav-text",
    component: <CustomerOrder />,
  },
  {
    title: "Orders",
    id: 8,
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
    component: <CustomerHomePage />,
  },
  {
    title: "Invoice Pending",
    id: 5,
    icon: <BsFillBoxSeamFill />,
    cName: "nav-text",
    component: <CustomerHomePage />,
  },
  {
    title: "Invoice Accepted",
    id: 6,
    icon: <RiVerifiedBadgeFill />,
    cName: "nav-text",
    component: <CustomerHomePage />,
  },
  {
    title: "Invoice Rejected",
    id: 7,
    icon: <BsXOctagonFill />,
    cName: "nav-text",
    component: <CustomerHomePage />,
  },
  {
    title: "Wallet",
    id:4 ,
    icon: <BsXOctagonFill />,
    cName: "nav-text",
    component: <Wallet />,
  },
  
];
