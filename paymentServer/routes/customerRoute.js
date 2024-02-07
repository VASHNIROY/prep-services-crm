const express = require("express");
const { isAuthenticatedCustomer } = require("../middleware/auth.js");
const { addMoney } = require("../controllers/customerController.js");

const customerRouter = express.Router();
customerRouter.post("/addmoney", isAuthenticatedCustomer, addMoney);

module.exports = { customerRouter };
