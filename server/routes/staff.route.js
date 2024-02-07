import express from "express";

import {
  staffRegistration,
  staffLogin,
  staffData,
  staffMebmers,
  updateStaffStatus,
  updateCustomerStatus,
  customersList,
  DeleteFile,
  getPrepProductList,
  getPrepServiceList,
  addProductService,
  getProductServicesList,
  getProductServiceById,
  updateProductService,
  getdispatch,
  DispatchOrder,
  getSpecificStaffDetails,
  updateStaffPassword,
  getCustomersByAdminAndOTP,
  updateCustomerAdminById,
  updateStaffDetails,
  getStaffDetailsById,
  updateStaffDetailsById,
  staffForgotPassword,
  staffResetPassword,
  staffVerifyEmailOTPSend,
  staffresendotp,
} from "../controllers/staff.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { addAmountTransaction } from "../controllers/customerControllers.js";

export const staffRouter = express.Router();

staffRouter.post("/staffregistration", staffRegistration);

staffRouter.post("/stafflogin", staffLogin);

staffRouter.get("/staffDetail", isAuthenticated, staffData);
staffRouter.get(
  "/staffmembers",
  isAuthenticated,
  authorizeRoles("Admin"),
  staffMebmers
);

staffRouter.put(
  "/update-staff-status/:id",
  isAuthenticated,
  authorizeRoles("Admin"),
  updateStaffStatus
);
staffRouter.get(
  "/customersList",
  isAuthenticated,
  authorizeRoles("Admin"),
  customersList
);
staffRouter.put(
  "/update-customer-status/:id",
  isAuthenticated,
  authorizeRoles("Admin"),
  updateCustomerStatus
);


staffRouter.post(
  "/add-productservice",
  isAuthenticated,
  authorizeRoles("Admin"),
  addProductService
);

staffRouter.get(
  "/getdispatch",
  isAuthenticated,
  authorizeRoles("Admin", "Dispatch"),
  getdispatch
);

staffRouter.put(
  "/dispatch/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Dispatch"),
  DispatchOrder
);

staffRouter.get(
  "/getCustomersByAdminAndOTP",
  isAuthenticated,
  getCustomersByAdminAndOTP
);

staffRouter.put(
  "/updateCustomerAdminById/:id",
  isAuthenticated,
  updateCustomerAdminById
);
staffRouter.post(
  "/addAmountTransaction/:id",
  isAuthenticated,
  addAmountTransaction
);

staffRouter.get(
  "/getSpecificStaffDetails",
  isAuthenticated,
  getSpecificStaffDetails
);
staffRouter.put("/updatestaffpassword", isAuthenticated, updateStaffPassword);
staffRouter.put("/updatestaffdetails", isAuthenticated, updateStaffDetails);

staffRouter.put(
  "/getStaffDetailsById/:id",
  isAuthenticated,
  getStaffDetailsById
);

staffRouter.put(
  "/updateStaffDetailsById/:id",
  isAuthenticated,
  updateStaffDetailsById
);

staffRouter.post("/staffforgetpassword", staffForgotPassword);
staffRouter.post("/staffresetpassword", staffResetPassword);
staffRouter.post("/staffcustomerotpverfiysend", staffVerifyEmailOTPSend);
staffRouter.post("/staffresendotp", staffresendotp);

staffRouter.get("/productservicelist", getProductServicesList);

staffRouter.get("/getprep-servicelist", getPrepServiceList);

staffRouter.get("/getprep-productlist", getPrepProductList);

staffRouter.get("/product-service/:id", getProductServiceById);
staffRouter.put("/product-service/:id", updateProductService);
staffRouter.delete("/deleteFile/:fileId", DeleteFile);
