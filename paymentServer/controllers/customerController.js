const CatchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { connection } = require("../utils/db.js");
const { chargeCreditCard } = require("./charge-credit-card.js");
const decrypt = require("../utils/decrypt");

exports.addMoney = CatchAsyncError(async (req, res, next) => {
  const customer_id = req.user.id;
  const { amount, number, expiry, cvc, name } = req.body;

  const amountValue = decrypt(amount);
  const cardNumber = decrypt(number);
  const expirationDate = decrypt(expiry);
  const cardCode = decrypt(cvc);
  const cardName = decrypt(name);

  try {
    // Query to get the last transaction ID
    const getLastTransactionId = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT MAX(id) AS last_id FROM transaction_table",
          (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(results[0].last_id || 0);
          }
        );
      });
    };

    const lastId = await getLastTransactionId();
    const nextId = lastId + 1;

    // Generate invoice ID
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const invoiceId = `AX-${formattedDate}${nextId}`;
    console.log(invoiceId);

    const type = "debit";
    chargeCreditCard(
      amountValue,
      cardNumber,
      cardName,
      expirationDate,
      cardCode,
      invoiceId,
      async (creditCardResponse) => {
        if (
          creditCardResponse &&
          creditCardResponse.messages &&
          creditCardResponse.messages.resultCode === "Ok" &&
          creditCardResponse.transactionResponse.responseCode === "1"
        ) {
          // If credit card authorization is successful, proceed with inserting the transaction into the database
          try {
            // Function to insert transaction into the database
            const insertTransactionIntoDatabase = async (
              customer_id,
              type,
              amountValue
            ) => {
              return new Promise((resolve, reject) => {
                connection.query(
                  "INSERT INTO transaction_table (customer_id, type, amount, transaction_date, transaction_time) VALUES ( ?, ?, ?, CURDATE(), CURTIME())",
                  [customer_id, type, amountValue],
                  (error, results) => {
                    if (error) {
                      reject(error);
                    }
                    resolve(results);
                  }
                );
              });
            };

            await insertTransactionIntoDatabase(customer_id, type, amountValue);
            console.log(creditCardResponse);
            res.json({
              success: true,
              message: "Transaction added successfully",
              creditCardResponse: creditCardResponse,
              // invoiceId: invoiceId,
            });
          } catch (error) {
            return next(new ErrorHandler(error.message, 500));
          }
        } else {
          // If credit card authorization fails, handle the error
          return next(
            new ErrorHandler("Credit card authorization failed", 500)
          );
        }
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
