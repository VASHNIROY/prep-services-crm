import express from "express";
import multer from "multer";
import path from "path";
import {
  customerRegistration,
  customerLogin,
  customerorder,
  customerData,
  customerOrderList,
  AcceptOrder,
  customerDetails,
  DeclineOrder,
  CustomerUpdateDetail,
  CustomerGetSpecificOrderDetails,
  GetCustomerBalance,
  getTransactionsByCustomerId,
  customerSideRegistration,
  verifyEmailOTP,
  getCustomerDetails,
  updateCustomerDetails,
  updateCustomerPassword,
  createPassword,
  forgotPassword,
  verifyEmailOTPSend,
  resetPassword,
  resendCustomerOTP,
} from "../controllers/customerControllers.js";
import {
  authorizeRoles,
  isAuthenticated,
  isAuthenticatedCustomer,
} from "../middleware/auth.js";
import { AdminUpdateOrderDetail } from "../controllers/orderControllers.js";
import { orderRouter } from "./order.route.js";
import { updateStaffDetails } from "../controllers/staff.controller.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "sai" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

export const customerRouter = express.Router();
customerRouter.post(
  "/registration",
  isAuthenticated,
  authorizeRoles("Admin"),
  customerRegistration
);

customerRouter.post("/customerregistration", customerSideRegistration);

customerRouter.post("/customerotpverfiy", verifyEmailOTP);

customerRouter.post("/customerotpverfiysend", verifyEmailOTPSend);

customerRouter.put("/createpassword/:token", createPassword);

customerRouter.post("/forgetpassword", forgotPassword);

customerRouter.post("/resetpassword", resetPassword);

customerRouter.post("/login", customerLogin);

customerRouter.post(
  "/customerorder",
  isAuthenticatedCustomer,
  upload.fields([{ name: "fnskuSendFiles" }, { name: "labelSendFiles" }]),
  customerorder
);

customerRouter.get("/customerdata", isAuthenticatedCustomer, customerData);

customerRouter.get(
  "/customerorderlist/:id",
  isAuthenticatedCustomer,
  customerOrderList
);

orderRouter.put(
  "/updateOrderDetails/:id",
  isAuthenticated,
  authorizeRoles("Admin", "Label"),
  upload.fields([{ name: "fnskuSendFiles" }, { name: "labelSendFiles" }]),
  AdminUpdateOrderDetail
);

customerRouter.post("/acceptOrder/:id", isAuthenticatedCustomer, AcceptOrder);
customerRouter.get(
  "/customermembers",
  isAuthenticated,
  authorizeRoles("Admin"),
  customerDetails
);
orderRouter.put("/declineOrder/:id", isAuthenticatedCustomer, DeclineOrder);

orderRouter.put(
  "/customerOrderDetail/:id",
  isAuthenticatedCustomer,
  upload.fields([{ name: "fnskuSendFiles" }, { name: "labelSendFiles" }]),
  CustomerUpdateDetail
);

orderRouter.get(
  "/getCustomerDetailOrder/:id",
  isAuthenticatedCustomer,
  CustomerGetSpecificOrderDetails
);
orderRouter.get("/getAmount", isAuthenticatedCustomer, GetCustomerBalance);

customerRouter.get(
  "/gettransaction",
  isAuthenticatedCustomer,
  getTransactionsByCustomerId
);

customerRouter.get(
  "/getcustomerdetails",
  isAuthenticatedCustomer,
  getCustomerDetails
);

customerRouter.put(
  "/updatespecificstaff",
  upload.single("profile"),
  isAuthenticated,
  updateStaffDetails
);

customerRouter.put(
  "/updatespecificcustomer",
  upload.single("profile"),
  isAuthenticatedCustomer,
  updateCustomerDetails
);

customerRouter.get(
  "/getspecificcustomerdetails",
  isAuthenticatedCustomer,
  getCustomerDetails
);
customerRouter.put(
  "/updatecustomerpassword",
  isAuthenticatedCustomer,
  updateCustomerPassword
);

customerRouter.put(
  "/updatestaffdetails",
  upload.single("profile"),
  isAuthenticated,
  updateStaffDetails
);

customerRouter.post("/resendCustomerOTP", resendCustomerOTP);
