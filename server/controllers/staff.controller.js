import { connection } from "../utils/db.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailerConfig from "../utils/nodemailerConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const staffRegistration = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    connection.query(
      "SELECT * FROM staff_table WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length > 0) {
          return next(new ErrorHandler("Email already exists", 400));
        }

        // Hash the user's password before storing it in the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return next(new ErrorHandler(err.message, 500));
          }

          // Insert user data into the database with the hashed password
          connection.query(
            "INSERT INTO staff_table (name, email, password, role, status,profile) VALUES (?, ?, ?, ?,?,?)",
            [name, email, hashedPassword, role, true, "blankimage.png"],
            (error) => {
              if (error) {
                return next(new ErrorHandler(error.message, 500)); // Handle database insertion error
              }

              // Send an email after successful registration
              const transporter = nodemailerConfig();
              const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email, // The recipient's email address
                subject: "Welcome to Our Staff Portal",
                text: `Dear ${name},\n\nThank you for registering with our staff portal. Your staff account is now active and ready for use. Your role is: ${role}\n\nYou can now log in with your email and password:${password}.`,
              };

              transporter.sendMail(mailOptions, (emailError, info) => {
                if (emailError) {
                  return next(new ErrorHandler("Email could not be sent", 500));
                }
              });

              res.status(201).json({
                success: true,
                message: "Staff Registered successfully",
              });
            }
          );
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
const SECRET_KEY = process.env.SECRET_KEY;

export const staffLogin = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Check if the email exists in the database
    connection.query(
      "SELECT * FROM staff_table WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Invalid email or password", 400));
        }

        const user = results[0];
        const role = user.role;
        const name = user.name;
        // Check if the provided password matches the one in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          return next(new ErrorHandler("Invalid email or password", 400));
        }
        if (!results[0].status) {
          return next(new ErrorHandler("Your account is Disabled by Admin"));
        }
        // Create a JWT token
        const token = jwt.sign({ email: user.email }, SECRET_KEY, {
          expiresIn: "48h",
        });

        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          role,
          name,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const staffData = CatchAsyncError(async (req, res, next) => {
  try {
    const name = req.user.name;
    const role = req.user.role;
    res.status(201).json({
      success: true,
      name,
      role,
      message: "Staff Details",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const staffMebmers = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM staff_table ORDER BY id DESC ",
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "staff Data",
          staffMembers: results,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateStaffStatus = async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;
  if (role === "Admin" && id == 1) {
    res.status(500).json({ message: "You can't disable  super admin" });
    return;
  }
  const updateQuery = "UPDATE staff_table SET status = ? WHERE id = ?";

  connection.query(updateQuery, [status, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Status updated successfully" });
    }
  });
};

export const customersList = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM customers WHERE otp_verfied = true AND admin = true ORDER BY id DESC",
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "staff Data",
          staffMembers: results,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateCustomerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updateQuery = "UPDATE customers SET status = ? WHERE id = ?";

  connection.query(updateQuery, [status, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Status updated successfully" });
    }
  });
};

export const DeleteFile = async (req, res) => {
  const fileId = req.params.fileId;
  const { orderId } = req.body;
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
  try {
    connection.query(
      "SELECT * FROM filesTable WHERE id = ?",
      [fileId],
      (error, results) => {
        if (error) {
        } else {
          const file = results[0].name;
          const filepath = path.join(__dirname, "../upload", file);
          fs.access(filepath, fs.constants.F_OK, (err) => {
            if (err) {
            } else {
              fs.unlink(filepath, (deleteErr) => {
                if (deleteErr) {
                }
              });
            }
          });
        }
      }
    );
    const result = await connection.query(
      "DELETE FROM filesTable WHERE id = ?",
      [fileId]
    );

    if (result) {
      updateLabelStatus(orderId);
      updateFnskuStatus(orderId);

      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addProductService = async (req, res, next) => {
  const { name, category, price } = req.body;
  try {
    if (!name || !category || !price) {
      return next(
        new ErrorHandler("Please provide name, category, and price", 400)
      );
    }
    connection.query(
      "INSERT INTO productservice (name, category, price,status) VALUES (?, ?, ?,?)",
      [name, category, price, 1],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "Product/Service added successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getProductServicesList = async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM productservice ORDER BY id DESC",
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "Product/Service list retrieved successfully",
          productServices: results, // Assuming 'results' contains the products/services data
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getPrepProductList = async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM productservice WHERE category = 'Product' AND status = 1 ORDER BY id DESC",
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "Product list retrieved successfully",
          products: results,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getPrepServiceList = async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM productservice WHERE category = 'Service' AND status = 1 ORDER BY id DESC",
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        res.status(200).json({
          success: true,
          message: "Service list retrieved successfully",
          services: results,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getProductServiceById = async (req, res, next) => {
  const productId = req.params.id;

  try {
    connection.query(
      "SELECT * FROM productservice WHERE id = ? ORDER BY id DESC",
      [productId],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Product/Service not found", 404));
        }

        const productService = results[0];
        res.status(200).json({
          success: true,
          data: productService,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const updateProductService = async (req, res, next) => {
  const productId = req.params.id;
  const { name, category, price } = req.body;
  try {
    if (!name || !category || !price) {
      return next(
        new ErrorHandler("Please provide name, category, and price", 400)
      );
    }
    connection.query(
      "UPDATE productservice SET name=?, category=?, price=? WHERE id = ?",
      [name, category, price, productId],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        if (results.affectedRows === 0) {
          return next(new ErrorHandler("Product/Service not found", 404));
        }

        res.status(200).json({
          success: true,
          message: "Product/Service updated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const changeProductServiceStatus = async (req, res, next) => {
  const productId = req.params.id;
  const newStatus = req.body.status;

  try {
    connection.query(
      "UPDATE productservice SET status=? WHERE id = ?",
      [newStatus, productId],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        res.status(200).json({
          success: true,
          message: "Product/Service status updated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// export const getdispatch = CatchAsyncError(async (req, res) => {
//   const status = 8; // Get the "id" from the URL parameters
//   const query =
//     "SELECT * FROM invoiceTable WHERE invoice_status >= 5 ORDER BY id DESC";
//   connection.query(query, [status], (error, results) => {
//     if (error) {
//       return res.status(500).send("Error fetching data from the database");
//     }
//     res.status(200).json(results);
//   });
// });
export const getdispatch = CatchAsyncError(async (req, res) => {
  const query =
    "SELECT * FROM invoiceTable WHERE invoice_status <=8 ORDER BY id DESC";
  connection.query(query, async (error, dispatchResults) => {
    if (error) {
      return res.status(500).send("Error fetching data from the database");
    }
    const ordersPromises = dispatchResults.map(async (dispatch) => {
      const orderIds = JSON.parse(dispatch.orders);
      const ordersQuery = `SELECT id, name, product, customer_name FROM order_table WHERE id IN (${orderIds.join(
        ","
      )})`;

      return new Promise((resolve, reject) => {
        connection.query(ordersQuery, (orderError, orderResults) => {
          if (orderError) {
            reject(orderError);
          } else {
            resolve({
              dispatch: dispatch,
              orders: orderResults,
            });
          }
        });
      });
    });

    try {
      const ordersData = await Promise.all(ordersPromises);
      res.status(200).json(ordersData);
    } catch (err) {
      res.status(500).send("Error fetching order data from the database");
    }
  });
});

export const DispatchOrder = CatchAsyncError(async (req, res) => {
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
            "UPDATE order_table SET status=? WHERE id = ?",
            [status, orderId],
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

export const getStaffDetailsById = CatchAsyncError(async (req, res, next) => {
  const staff_id = req.params.id;
  connection.query(
    "SELECT * FROM staff_table WHERE id = ?",
    [staff_id],
    (error, results) => {
      if (error) {
        return next(new ErrorHandler(error.message, 500)); // Handle database query error
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      const staffDetails = results[0];
      res.json({ staff: staffDetails });
    }
  );
});

export const updateStaffDetailsById = CatchAsyncError(
  async (req, res, next) => {
    const staff_id = req.params.id;
    if (staff_id == 1) {
      res
        .status(500)
        .json({ message: "You can't edit and update super admin" });
      return;
    }
    try {
      const { name, email, role } = req.body;
      connection.query(
        "UPDATE staff_table SET name = ?, email = ?, role = ? WHERE id = ?",
        [name, email, role, staff_id],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500)); // Handle database update error
          }

          if (results.affectedRows === 0) {
            return next(
              new ErrorHandler("Staff member not found or unauthorized", 404)
            );
          }

          res.json({
            success: true,
            message: "Staff details updated successfully",
          });
        }
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getCustomersByAdminAndOTP = CatchAsyncError(
  async (req, res, next) => {
    try {
      connection.query(
        "SELECT * FROM customers WHERE admin = false AND otp_verfied = true",
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500)); // Handle database query error
          }

          res.json({
            success: true,
            customers: results,
          });
        }
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateCustomerAdminById = CatchAsyncError(
  async (req, res, next) => {
    const customer_id = req.params.id;
    try {
      const { admin } = req.body;

      // Update the admin status
      connection.query(
        "UPDATE customers SET admin = ? WHERE id = ?",
        [admin, customer_id],
        (updateError, updateResults) => {
          if (updateError) {
            return next(new ErrorHandler(updateError.message, 500));
          }

          // If admin is set to false, delete the customer
          if (admin === false) {
            connection.query(
              "DELETE FROM customers WHERE id = ?",
              [customer_id],
              (deleteError, deleteResults) => {
                if (deleteError) {
                  return next(new ErrorHandler(deleteError.message, 500));
                }
              }
            );
          }

          // Check if any rows were affected
          if (updateResults.affectedRows === 0) {
            return next(
              new ErrorHandler("Customer not found or unauthorized", 404)
            );
          }

          // Fetch customer details after the update
          connection.query(
            "SELECT * FROM customers WHERE id = ?",
            [customer_id],
            (selectError, selectResults) => {
              if (selectError) {
                return next(new ErrorHandler(selectError.message, 500));
              }

              const customer = selectResults[0];

              const transporter = nodemailerConfig();
              const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: customer.email,
                subject: "Welcome to AX Xpress!",
                html: `
                  <p>Dear ${customer.name},</p>
                  <p>Congratulations! Your registration with AX Xpress has been accepted. We are thrilled to welcome you as part of our community.</p>
                  <p>You can now log in to your account using your credentials.</p>
                  <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                  <p>Thank you for choosing AX Xpress!</p>
                `,
              };

              transporter.sendMail(mailOptions, (emailError, info) => {
                if (emailError) {
                  return next(new ErrorHandler("Email could not be sent", 500));
                }

                res.status(201).json({
                  success: true,
                  message: "Customer Accepted successfully",
                });
              });
            }
          );
        }
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getSpecificStaffDetails = CatchAsyncError(async (req, res) => {
  const customer_id = req.user.id;
  const getCustomerDetailsQuery = "SELECT * FROM staff_table WHERE id = ?";
  connection.query(getCustomerDetailsQuery, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const staffDetails = results[0];
    return res.json({ staff: staffDetails });
  });
});

export const updateStaffDetails = CatchAsyncError(async (req, res, next) => {
  const staff_id = req.user.id;
  try {
    const { name, mobile_number, Address } = req.body;
    const newProfilePic = req.file ? req.file.filename : req.user.profile;
    connection.query(
      `UPDATE staff_table
        SET name = ?, profile = ?, mobile_number = ?, Address = ?
        WHERE id = ?
      `,
      [name, newProfilePic, mobile_number, Address, staff_id],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler("Internal Server Error", 500));
        }
        if (results.affectedRows === 0) {
          return next(new ErrorHandler("staff not found or unauthorized", 404));
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

export const updateStaffPassword = CatchAsyncError(async (req, res, next) => {
  const staff_id = req.user.id;
  try {
    const { currentPassword, newPassword } = req.body;
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      req.user.password
    );
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid current password", 400));
    }

    bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
      if (err) {
        return next(new ErrorHandler(err.message, 500));
      }
      connection.query(
        `UPDATE staff_table
        SET password = ?
        WHERE id = ?
      `,
        [hashedNewPassword, staff_id],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler("Internal Server Error", 500));
          }
          if (results.affectedRows === 0) {
            return next(
              new ErrorHandler("staff not found or unauthorized", 404)
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
});

export const staffForgotPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    connection.query(
      "SELECT * FROM staff_table WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Email not found", 404));
        }
        const user = results[0];

        const otp = generateOTP();
        // Implement a function to generate a random OTP
        connection.query(
          "UPDATE staff_table SET otp = ? WHERE email = ?",
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

function generateOTP() {
  // Generate a 4-digit random OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const staffVerifyEmailOTPSend = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      // Check if the provided OTP matches the stored OTP for the given email
      connection.query(
        "SELECT * FROM staff_table WHERE email = ? AND otp = ?",
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
            "UPDATE staff_table SET otp = null WHERE email = ?",
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
  }
);

export const staffResetPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { password, email } = req.body;

    connection.query(
      "SELECT * FROM staff_table WHERE email = ?",
      [email],
      (queryError, results) => {
        if (queryError) {
          return next(new ErrorHandler(queryError.message, 500));
        }

        if (results.length === 0) {
          return next(new ErrorHandler("Invalid email", 400));
        }

        bcrypt.hash(password, 10, (hashError, hashedPassword) => {
          if (hashError) {
            return next(new ErrorHandler(hashError.message, 500));
          }

          const user = results[0];
          const userId = user.id;

          connection.query(
            "UPDATE staff_table SET password = ?  WHERE id = ?",
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
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const staffresendotp = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    connection.query(
      "UPDATE staff_table SET otp = ? WHERE email = ?",
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
