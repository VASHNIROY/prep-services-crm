import { connection } from "../utils/db.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailerConfig from "../utils/nodemailerConfig.js";
import { generateToken, verifyToken } from "../utils/genrateKey.js";

dotenv.config();

const baseUrl = process.env.BASE_URL;

export const customerRegistration = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const baseUrl = process.env.BASE_URL;

    // Generate a token
    const token = generateToken(email, process.env.SECRET_KEY); // Adjust parameters as needed

    // Construct the URL for creating a password with the token as a query parameter
    const createPasswordUrl = `${baseUrl}createpassword/${token}?email=${email}`;

    connection.query(
      "SELECT * FROM customers WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length > 0) {
          return next(new ErrorHandler("Email already exists", 400));
        }

        // Insert user data into the database without the password
        connection.query(
          "INSERT INTO customers (name, email, status, admin, profile) VALUES (?,?,?,?,?)",
          [name, email, true, false, "blankimage.png"],
          (error) => {
            if (error) {
              return next(new ErrorHandler(error.message, 500)); // Handle database insertion error
            }

            // Send an email with an anchor element for creating a password
            const transporter = nodemailerConfig();
            const mailOptions = {
              from: process.env.SMTP_MAIL,
              to: email,
              subject: "Welcome to AX Xpress! Complete Your Registration",
              html: `
                <p>Dear ${name},</p>
                <p>Thank you for registering with AX Xpress. We are delighted to have you as part of our community, and we want to extend a warm welcome to you.</p>
                <p>To complete your registration and set up your password, please click on the following link:</p>
                <p><a href="${createPasswordUrl}" target="_blank">Complete Registration</a></p>
              `,
            };

            transporter.sendMail(mailOptions, (emailError, info) => {
              if (emailError) {
                return next(new ErrorHandler("Email could not be sent", 500));
              }

              res.status(201).json({
                success: true,
                message: "Customer Registered successfully",
              });
            });
          }
        );
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const createPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = req.query;
    const { password } = req.body;

    const isTokenValid = verifyToken(token, email, process.env.SECRET_KEY);

    if (!isTokenValid) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        return next(new ErrorHandler(hashError.message, 500));
      }

      connection.query(
        "SELECT * FROM customers WHERE email = ?",
        [email],
        (queryError, results) => {
          if (queryError) {
            return next(new ErrorHandler(queryError.message, 500));
          }

          if (results.length === 0) {
            return next(new ErrorHandler("Invalid email", 400));
          }

          const user = results[0];
          const userId = user.id;

          connection.query(
            "UPDATE customers SET password = ?, email_hash = null, otp_verfied = true, admin = true WHERE id = ?",
            [hashedPassword, userId],
            (updateError) => {
              if (updateError) {
                return next(new ErrorHandler(updateError.message, 500));
              }

              res.status(200).json({
                success: true,
                message: "Password set successfully",
              });
            }
          );
        }
      );
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const customerSideRegistration = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if email already exists
      connection.query(
        "SELECT * FROM customers WHERE email = ?",
        [email],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500));
          }

          if (results.length > 0) {
            return next(new ErrorHandler("Email already exists", 400));
          }

          // Generate OTP
          const otp = generateOTP();

          // Hash the user's password before storing it in the database
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              return next(new ErrorHandler(err.message, 500));
            }

            // Insert user data into the database with default image, status as false, and store the OTP
            connection.query(
              "INSERT INTO customers (name, email, profile, status, otp, password,otp_verfied, admin) VALUES (?, ?, ?, ?, ?, ?,?,?)",
              [
                name,
                email,
                "blankimage.png",
                true,
                otp,
                hashedPassword,
                false,
                false,
              ],
              (insertError) => {
                if (insertError) {
                  return next(new ErrorHandler(insertError.message, 500));
                }

                // Send OTP for email verification
                const transporter = nodemailerConfig();
                const mailOptions = {
                  from: process.env.SMTP_MAIL,
                  to: email,
                  subject: "AX Xpress Email Verification OTP",
                  text: `Dear ${name},\n\nYour email verification OTP is: ${otp}`,
                };

                transporter.sendMail(mailOptions, (emailError) => {
                  if (emailError) {
                    return next(
                      new ErrorHandler("Email could not be sent", 500)
                    );
                  }
                  res.status(200).json({
                    success: true,
                    message:
                      "Registered successfully. Check your email for verification OTP.",
                  });
                });
              }
            );
          });
        }
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const verifyEmailOTP = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // Check if the provided OTP matches the stored OTP for the given email
    connection.query(
      "SELECT * FROM customers WHERE email = ? AND otp = ?",
      [email, otp],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Invalid OTP", 500));
        }

        // Update customer status to active since OTP is verified
        connection.query(
          "UPDATE customers SET otp_verfied = true, otp = null WHERE email = ?",
          [email],
          (updateError) => {
            if (updateError) {
              return next(new ErrorHandler(updateError.message, 500));
            }

            res.status(200).json({
              success: true,
              message:
                "Email verification successful. Admin will Accept you request soon.",
            });
          }
        );
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const resendCustomerOTP = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    connection.query(
      "UPDATE customers SET otp = ? WHERE email = ?",
      [otp, email],
      (updateError) => {
        if (updateError) {
          return next(new ErrorHandler(updateError.message, 500));
        }
        const transporter = nodemailerConfig();
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: email,
          subject: "AX Xpress Resend OTP",
          text: `Dear ${email},\n\nYour OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (emailError) => {
          if (emailError) {
            return next(new ErrorHandler("Email could not be sent", 500));
          }
          res.status(200).json({
            success: true,
            message: "OTP has been resent successfully.",
          });
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const forgotPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    connection.query(
      "SELECT * FROM customers WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Email not found", 404));
        }
        const user = results[0];
        // Generate and save OTP in the database (you may want to handle this securely, such as using a separate OTP table)
        const otp = generateOTP();
        // Implement a function to generate a random OTP
        connection.query(
          "UPDATE customers SET otp = ? WHERE email = ?",
          [otp, email],
          (otpUpdateError) => {
            if (otpUpdateError) {
              return next(new ErrorHandler(otpUpdateError.message, 500));
            }

            // Send an email with the OTP
            const transporter = nodemailerConfig();
            const mailOptions = {
              from: process.env.SMTP_MAIL,
              to: email,
              subject: "Forgot Password - AX Xpress",
              html: `
                <p>Dear ${user.name},</p>
                <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
              `,
            };

            transporter.sendMail(mailOptions, (emailError, info) => {
              if (emailError) {
                return next(new ErrorHandler("Email could not be sent", 500));
              }

              res.status(200).json({
                success: true,
                message: "OTP sent to your email. Check your inbox.",
              });
            });
          }
        );
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const verifyEmailOTPSend = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // Check if the provided OTP matches the stored OTP for the given email
    connection.query(
      "SELECT * FROM customers WHERE email = ? AND otp = ?",
      [email, otp],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.length === 0) {
          return next(new ErrorHandler("invalid OTP", 500));
        }

        // Update customer status to active since OTP is verified
        connection.query(
          "UPDATE customers SET otp = null WHERE email = ?",
          [email],
          (updateError) => {
            if (updateError) {
              return next(new ErrorHandler(updateError.message, 500));
            }

            res.status(200).json({
              success: true,
              message: "Email verification successful",
            });
          }
        );
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const resetPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { password, email } = req.body;

    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        return next(new ErrorHandler(hashError.message, 500));
      }

      connection.query(
        "SELECT * FROM customers WHERE email = ?",
        [email],
        (queryError, results) => {
          if (queryError) {
            return next(new ErrorHandler(queryError.message, 500));
          }

          if (results.length === 0) {
            return next(new ErrorHandler("Invalid email", 400));
          }

          const user = results[0];
          const userId = user.id;

          connection.query(
            "UPDATE customers SET password = ?  WHERE id = ?",
            [hashedPassword, userId],
            (updateError) => {
              if (updateError) {
                return next(new ErrorHandler(updateError.message, 500));
              }

              res.status(200).json({
                success: true,
                message: "Password set successfully",
              });
            }
          );
        }
      );
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

function generateOTP() {
  // Generate a 4-digit random OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const SECRET_KEY = process.env.SECRET_KEY;

export const customerLogin = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Check if the email exists in the database
    connection.query(
      "SELECT * FROM customers WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Invalid email or password", 400));
        }

        const user = results[0];
        const name = user.name;
        if (!results[0].password) {
          return next(new ErrorHandler("create your password first", 400));
        }
        if (!results[0].admin) {
          return next(
            new ErrorHandler("Your account is not verified by the Admin")
          );
        }

        if (!results[0].status) {
          return next(new ErrorHandler("Your account is Disabled by Admin"));
        }

        // Check if the provided password matches the one in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Create a JWT token
        const token = jwt.sign({ email: user.email }, SECRET_KEY, {
          expiresIn: "48h",
        });

        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          role: "Customer",
          name,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const customerorder = async (req, res, next) => {
  try {
    const {
      service,
      product,
      name,
      units,
      tracking_url,
      date,
      customer_id,
      instructions,
      selectedProducts,
    } = req.body;

    const parsedProducts = JSON.parse(selectedProducts);
    const req_id = req.user.id;
    const customerName = req.user.name;

    const fnskuFiles = req.files["fnskuSendFiles"];
    const labelFiles = req.files["labelSendFiles"];
    let fnskuStatus = false;
    let labelStatus = false;
    if (fnskuFiles) {
      fnskuStatus = true;
    }
    if (labelFiles) {
      labelStatus = true;
    }
    connection.query(
      `
      INSERT INTO order_table (byid, customer_id,customer_name, name, service, product, unit, tracking_url, date, status, instructions,fnsku_status,label_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?);
      `,
      [
        req_id,
        customer_id,
        customerName,
        name,
        service,
        product,
        units,
        tracking_url,
        date,
        0,
        instructions,
        fnskuStatus,
        labelStatus,
      ],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        // Save file details for fnskuSend
        if (fnskuFiles) {
          saveFileDetails(fnskuFiles, "fnskuSend", results.insertId);
        }

        // Save file details for labelSend
        if (labelFiles) {
          saveFileDetails(labelFiles, "labelSend", results.insertId);
        }

        // Call insertData outside of saveFileDetails
        insertData1(parsedProducts, results.insertId);

        // Respond with success message
        res.status(201).json({
          success: true,
          message: "Order Placed",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

const saveFileDetails = async (files, type, orderId) => {
  const fileDetails = files.map((file) => ({
    orderId,
    type,
    name: file.filename,
  }));

  await Promise.all(
    fileDetails.map(async (fileDetail) => {
      await connection.query(
        "INSERT INTO filesTable (orderId, type, name) VALUES (?, ?, ?)",
        [fileDetail.orderId, fileDetail.type, fileDetail.name]
      );
    })
  );
};
const insertData1 = async (data, orderId) => {
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [data];
  const query =
    "INSERT INTO orderServices (orderId, services, quantity) VALUES (?, ?, ?)";
  try {
    // Execute all queries concurrently using Promise.all
    const results = await Promise.all(
      dataArray.map((item) => {
        const params = [orderId, item.id, item.quantity];
        return new Promise((resolve, reject) => {
          connection.query(query, params, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      })
    );
  } catch (error) {
    throw error;
  }
};

export const customerData = CatchAsyncError(async (req, res, next) => {
  try {
    const name = req.user.name;
    const id = req.user.id;
    res.status(201).json({
      success: true,
      name,
      id,
      message: "Customer Details",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const customerOrderList = CatchAsyncError(async (req, res, next) => {
  try {
    const customer_id = req.user.id;
    const status = req.params.id;
    if (status === "9") {
      // If status is 8, change the query to get all products with a status below 8
      connection.query(
        "SELECT * FROM order_table WHERE customer_id = ? AND status < 9 ORDER BY id DESC",
        [customer_id],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500)); // Handle database query error
          }
          if (results.length > 0) {
            // If there are orders matching the criteria, return them
            res.status(200).json({
              success: true,
              results,
            });
          } else {
            return next(
              new ErrorHandler("No orders with a status below 8", 404)
            );
          }
        }
      );
    } else {
      // For other status values, use the original query
      connection.query(
        "SELECT * FROM order_table WHERE customer_id = ? AND status = ? ORDER BY id DESC",
        [customer_id, status],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500)); // Handle database query error
          }
          if (results.length > 0) {
            res.status(200).json({
              success: true,
              results,
            });
          } else {
            return next(
              new ErrorHandler("No orders with the specified status", 404)
            );
          }
        }
      );
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const AcceptOrder = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const customer_id = req.user.id;
  const { amount, orderIds, status } = req.body;
  const parsedOrderIds = JSON.parse(orderIds);

  try {
    const query =
      "SELECT customer_id, SUM(amount) as total_amount FROM transaction_table WHERE customer_id = ?";
    const results = await new Promise((resolve, reject) => {
      connection.query(query, [customer_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (results.length === 0 || results[0].total_amount > amount) {
      await new Promise((resolve, reject) => {
        connection.query(
          "UPDATE invoiceTable SET invoice_status=? WHERE id = ?",
          [status, id],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });

      await Promise.all(
        parsedOrderIds.map(async (orderId) => {
          await new Promise((resolve, reject) => {
            connection.query(
              "UPDATE order_table SET status=?, payment_status=? WHERE id = ?",
              [6, true, orderId],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              }
            );
          });
        })
      );

      await new Promise((resolve, reject) => {
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentTime = new Date().toISOString().slice(11, 19);

        const insertQuery = `INSERT INTO transaction_table (customer_id, order_ids, amount, transaction_date, transaction_time, type) VALUES (?, ?, ?, ?, ?, ?)`;
        connection.query(
          insertQuery,
          [
            customer_id,
            orderIds,
            `-${amount}`,
            currentDate,
            currentTime,
            "credit",
          ],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
      res.status(200).json({
        success: true,
        message: "Order Accepted",
      });
    } else {
      res.status(500).json({
        success: false,
        message:
          "The Invoice amount more than the available amount. Order cannot be accepted.",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const DeclineOrder = CatchAsyncError(async (req, res) => {
  const id = req.params.id;
  const { status, orderIds } = req.body;
  const parsedOrderIds = JSON.parse(orderIds);
  try {
    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE invoiceTable SET invoice_status=? WHERE id = ?",
        [status, id],
        (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        }
      );
    });
    await Promise.all(
      parsedOrderIds.map(async (orderId) => {
        await new Promise((resolve, reject) => {
          connection.query(
            "UPDATE order_table SET status=?, payment_status=? WHERE id = ?",
            [status, false, orderId],
            (error) => {
              if (error) {
                return reject(error);
              }
              resolve();
            }
          );
        });
      })
    );
    res.status(200).json({
      success: true,
      message: "Order Accepted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const CustomerAddAmount = CatchAsyncError(async (req, res) => {
  // Get the "id" from the URL parameters
  const customer_id = req.user.id;
  const { amount } = req.body;
  // Create the INSERT SQL query with the "id" from the request parameters
  const insertQuery = `INSERT INTO transaction_table ( customer_id, amount, type) VALUES (?, ?, ?)`;

  // Execute the query
  connection.query(
    insertQuery,
    [customer_id, `+${amount}`, "credit"],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error inserting data" });
      } else {
        res.status(200).json({ message: "Invoice Accepted" });
      }
    }
  );
});

export const customerDetails = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query("SELECT * FROM customers ", async (error, results) => {
      if (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(200).json({
        success: true,
        message: "customer Data",
        customerMembers: results,
      });
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const CustomerUpdateDetail = CatchAsyncError(async (req, res, next) => {
  try {
    const {
      name,
      service,
      product,
      unit,
      tracking_url,
      instructions,
      orderId,
      selectedProducts,
    } = req.body;
    const parsedProducts = JSON.parse(selectedProducts);
    const fnskuFiles = req.files["fnskuSendFiles"];
    const labelFiles = req.files["labelSendFiles"];
    connection.query(
      `UPDATE order_table SET 
          name=?,
          service = ?,
          product = ?,
          unit = ?,
          tracking_url = ?,
          instructions=?
          WHERE id = ?`,
      [
        name,
        service,
        product,
        unit,
        tracking_url,
        instructions,
        Number(orderId),
      ],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        if (results.affectedRows === 0) {
          return next(new ErrorHandler("Order not found", 404));
        }
        if (fnskuFiles) {
          saveFileDetails(fnskuFiles, "fnskuSend", orderId);
        }
        if (labelFiles) {
          saveFileDetails(labelFiles, "labelSend", orderId);
        }
        deleteOrderServices(orderId);
        insertData1(parsedProducts, orderId);

        updateLabelStatus(orderId);
        updateFnskuStatus(orderId);

        res.status(200).json({
          success: true,
          message: "Order updated",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }

  const saveFileDetails = async (files, type, orderId) => {
    const fileDetails = files.map((file) => ({
      orderId,
      type,
      name: file.filename,
    }));
    await Promise.all(
      fileDetails.map(async (fileDetail) => {
        await connection.query(
          "INSERT INTO filesTable (orderId, type, name) VALUES (?, ?, ?)",
          [fileDetail.orderId, fileDetail.type, fileDetail.name]
        );
      })
    );
  };

  const updateFnskuStatus = async (orderId) => {
    await updateFileStatus("fnsku_status", "fnskuSend", orderId);
  };

  const updateLabelStatus = async (orderId) => {
    await updateFileStatus("label_status", "labelSend", orderId);
  };

  const updateFileStatus = (columnName, name, orderId) => {
    const selectQuery =
      "SELECT * FROM filesTable WHERE orderId = ? AND type = ?";
    connection.query(selectQuery, [orderId, name], (selectError, filesData) => {
      if (selectError) {
        return callback(selectError);
      }
      const count = filesData.length > 0 ? true : false;
      const updateQuery = `UPDATE order_table SET ${columnName} = ? WHERE id = ?`;
      connection.query(updateQuery, [count, orderId], (updateError) => {
        if (updateError) {
        }
      });
    });
  };
  const deleteOrderServices = async (orderId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `
    DELETE FROM orderServices
    WHERE orderId=?
    `,
        [orderId], // Delete entries related to the specific order ID
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };
  const insertData1 = async (data, orderId) => {
    // Ensure data is an array
    const dataArray = Array.isArray(data) ? data : [data];
    const query =
      "INSERT INTO orderServices (orderId, services, quantity) VALUES (?, ?, ?)";
    try {
      // Execute all queries concurrently using Promise.all
      const results = await Promise.all(
        dataArray.map((item) => {
          const params = [orderId, item.id, item.quantity];
          return new Promise((resolve, reject) => {
            connection.query(query, params, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          });
        })
      );
    } catch (error) {
      throw error;
    }
  };
});

export const CustomerGetSpecificOrderDetails = CatchAsyncError(
  async (req, res) => {
    const orderId = req.params.id;

    // Perform a SQL query to fetch order details based on the provided ID
    const orderSql = "SELECT * FROM order_table WHERE id = ?";
    connection.query(orderSql, [orderId], async (orderErr, orderResults) => {
      if (orderErr) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (orderResults.length === 0) {
          res.status(404).json({ error: "Order data not found" });
        } else {
          const orderData = orderResults[0];

          // Perform a SQL query to fetch files based on the order ID and type
          const filesSql =
            "SELECT * FROM filesTable WHERE orderId = ? AND type IN (?, ?)";
          connection.query(
            filesSql,
            [orderId, "fnskuSend", "labelSend"],
            (filesErr, filesResults) => {
              if (filesErr) {
                res.status(500).json({ error: "Internal server error" });
              } else {
                // Perform a SQL query to fetch services based on the order ID
                const servicesSql = `
                  SELECT orderServices.*, productservice.category
                  FROM orderServices
                  JOIN productservice ON orderServices.services = productservice.id
                  WHERE orderServices.orderId = ?
                `;
                connection.query(
                  servicesSql,
                  orderId,
                  (serviceErr, serviceResults) => {
                    if (serviceErr) {
                      res.status(500).json({ error: "Internal server error" });
                    } else {
                      const responseData = {
                        order: orderData,
                        files: filesResults,
                        services: {
                          Products: [],
                          Services: [],
                        },
                      };

                      serviceResults.forEach((service) => {
                        if (service.category === "Product") {
                          responseData.services.Products.push(service);
                        } else {
                          responseData.services.Services.push(service);
                        }
                      });

                      res.status(200).json(responseData);
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  }
);

export const GetCustomerBalance = CatchAsyncError(async (req, res) => {
  const customer_id = req.user.id;

  // Execute a SQL query to sum 'amount' for the given 'customer_id'
  const query =
    "SELECT customer_id, SUM(amount) as total_amount FROM transaction_table WHERE customer_id = ?";
  connection.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.json({ customer_id, total_amount: 0 });
    }
    const { customer_id, total_amount } = results[0];
    return res.json({ customer_id, total_amount });
  });
});

export const getTransactionsByCustomerId = async (req, res, next) => {
  const customerId = req.user.id;

  try {
    connection.query(
      "SELECT * FROM transaction_table WHERE customer_id = ? ORDER BY id DESC",
      [customerId],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.length === 0) {
          return next(
            new ErrorHandler("No transactions found for this customer", 404)
          );
        }

        res.status(200).json({
          success: true,
          data: results,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getCustomerDetails = CatchAsyncError(async (req, res) => {
  const customer_id = req.user.id;
  const getCustomerDetailsQuery = "SELECT * FROM customers WHERE id = ?";
  connection.query(getCustomerDetailsQuery, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const customerDetails = results[0];
    return res.json({ customer: customerDetails });
  });
});

export const updateCustomerDetails = CatchAsyncError(async (req, res, next) => {
  const customer_id = req.user.id;
  try {
    const { name, mobile_number, Address } = req.body;
    const newProfilePic = req.file ? req.file.filename : req.user.profile;
    connection.query(
      `UPDATE customers
        SET name = ?, profile = ?, mobile_number = ?, Address = ?
        WHERE id = ?
      `,
      [name, newProfilePic, mobile_number, Address, customer_id],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler("Internal Server Error", 500));
        }
        if (results.affectedRows === 0) {
          return next(
            new ErrorHandler("Customer not found or unauthorized", 404)
          );
        }
        res.json({
          success: true,
          message: "Details updated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateCustomerPassword = CatchAsyncError(
  async (req, res, next) => {
    const customer_id = req.user.id;

    try {
      const { currentPassword, newPassword } = req.body;
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        req.user.password
      );
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
        if (err) {
          return next(new ErrorHandler(err.message, 500));
        }
        connection.query(
          `UPDATE customers
        SET password = ?
        WHERE id = ?
      `,
          [hashedNewPassword, customer_id],
          (error, results) => {
            if (error) {
              return next(new ErrorHandler("Internal Server Error", 500));
            }
            if (results.affectedRows === 0) {
              return next(
                new ErrorHandler("Customer not found or unauthorized", 404)
              );
            }
            res.json({
              success: true,
              message: "Password updated successfully",
            });
          }
        );
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const addAmountTransaction = CatchAsyncError(async (req, res, next) => {
  const { amount } = req.body;
  const customer_id = req.params.id; // Assuming 'customer_id' is the parameter name in the route
  try {
    const type = "debit";
    connection.query(
      "INSERT INTO transaction_table (customer_id, type, amount, transaction_date, transaction_time) VALUES (?, ?, ?, CURDATE(), CURTIME())",
      [customer_id, type, amount],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database insertion error
        }
        res.json({
          success: true,
          message: "Transaction added successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
