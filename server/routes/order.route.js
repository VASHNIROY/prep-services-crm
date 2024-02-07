import express from "express";
import {
  AdminUpdateOrder,
  AdminGetSpecificOrderDetails,
  GetOrders,
  dimensionOrderList,
  dimensionUpdate,
  labelOrderList,
  labelUpdate,
  AmountUpdate,
  AccountOrders,
  CreateDimension,
  GetDimensionsByOrderId,
  UpdateDimensionById,
  AdminUpdateOrderquantity,
  updateServiceStatus,
  generateInvoices,
  postgenerateInvoice,
  getInvoices,
  deleteDimension,
  UpdateDiscount,
} from "../controllers/orderControllers.js";
import {
  authorizeRoles,
  isAuthenticated,
  isAuthenticatedCustomer,
} from "../middleware/auth.js";
export const orderRouter = express.Router();

orderRouter.put(
  "/adminUpdateOrderStatus/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Dimension"),
  AdminUpdateOrder
);
orderRouter.get(
  "/getAdminOrderDetails/:id",
  isAuthenticated,
  AdminGetSpecificOrderDetails
);
orderRouter.get(
  "/getOrders/:status",
  isAuthenticated,
  authorizeRoles("Admin"),
  GetOrders
);
orderRouter.put(
  "/dimensionupdate/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Dimension"),
  dimensionUpdate
);
orderRouter.get(
  "/dimensionorderlist",
  isAuthenticated,
  authorizeRoles("Admin", "Dimension"),
  dimensionOrderList
);
orderRouter.get(
  "/labelorderlist",
  isAuthenticated,
  authorizeRoles("Admin", "Label"),
  labelOrderList
);
orderRouter.put(
  "/updatelabelorder/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Label"),
  labelUpdate
);
orderRouter.get(
  "/accountantlist",
  isAuthenticated,
  authorizeRoles("Admin", "Accountant"),
  AccountOrders
);
orderRouter.put(
  "/amountUpdate/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Accountant"),
  AmountUpdate
);

orderRouter.post("/CreateDimension/:id", isAuthenticated, CreateDimension);
orderRouter.get("/getdimensionbyid/:id", GetDimensionsByOrderId);
orderRouter.put(
  "/updatedimensionbyid/:id",
  isAuthenticated,
  UpdateDimensionById
);
orderRouter.put(
  "/updateOrderQuantity/:id",
  isAuthenticated,
  AdminUpdateOrderquantity
);
orderRouter.put(
  "/updateServiceStatus/:id",
  isAuthenticated,
  updateServiceStatus
);
orderRouter.post("/generateInvoices", generateInvoices);
orderRouter.post("/postgenerateInvoice", postgenerateInvoice);
orderRouter.get("/invoicepending/:id", isAuthenticatedCustomer, getInvoices);
orderRouter.delete("/deleteDimension/:id", isAuthenticated, deleteDimension);
orderRouter.put("/updatediscount/:id", isAuthenticated, UpdateDiscount);
