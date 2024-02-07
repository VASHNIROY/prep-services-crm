import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_PYT_SECRET;

export function encrypt(dataToEncrypt) {
  const encryptedData = CryptoJS.AES.encrypt(
    dataToEncrypt,
    secretKey
  ).toString();
  return encryptedData;
}
