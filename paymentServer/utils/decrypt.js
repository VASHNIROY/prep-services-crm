const CryptoJS = require("crypto-js");
require("dotenv").config();

const secretKey = process.env.PYT_SECRET;

module.exports = function decrypt(encryptedData) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
