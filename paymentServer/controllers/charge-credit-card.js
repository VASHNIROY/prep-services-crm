const ApiContracts = require("authorizenet").APIContracts;
const SDKConstants = require("authorizenet").Constants;
const ApiControllers = require("authorizenet").APIControllers;
require("dotenv").config();

function chargeCreditCard(
  amountValue,
  cardNumber,
  cardName,
  expirationDate,
  cardCode,
  invoiceId,
  callback
) {
  const API_LOGIN_KEY = process.env.API_LOGIN_KEY;
  const TRANSACTION_KEY = process.env.TRANSACTION_KEY;

  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(API_LOGIN_KEY);
  merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cardNumber);
  creditCard.setExpirationDate(expirationDate);
  creditCard.setCardCode(cardCode);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(invoiceId);
  orderDetails.setDescription("Wallet Amount");

  const billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName(cardName);
  billTo.setLastName("");
  billTo.setCompany("Ax xpress");
  billTo.setAddress("6102 N Damen Ave");
  billTo.setCity("chicago");
  billTo.setState("IL");
  billTo.setZip("60659");
  billTo.setCountry("USA");

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(amountValue);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setBillTo(billTo);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {
    const apiResponse = ctrl.getResponse();
    const response = new ApiContracts.CreateTransactionResponse(apiResponse);
    callback(response);
  });
}

module.exports.chargeCreditCard = chargeCreditCard;
