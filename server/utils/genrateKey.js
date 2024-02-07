import crypto from "crypto";

export function generateToken(data, secretKey) {
  // Combine data with the secret key
  const combinedData = data + secretKey;

  // Create an MD5 hash of the combined data
  const hashedData = crypto
    .createHash("md5")
    .update(combinedData)
    .digest("hex");

  return hashedData;
}

export function verifyToken(token, originalData, secretKey) {
  // Combine original data with the secret key
  const combinedData = originalData + secretKey;

  // Create an MD5 hash of the combined data
  const hashedData = crypto
    .createHash("md5")
    .update(combinedData)
    .digest("hex");

  // Verify that the token matches the hash of the original data and secret key
  return token === hashedData;
}
