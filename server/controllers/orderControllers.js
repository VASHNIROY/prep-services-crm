import CatchAsyncError from "../middleware/catchAsyncError.js";
import { connection } from "../utils/db.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const AdminUpdateOrder = CatchAsyncError(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const sql = "UPDATE order_table SET status = ? WHERE id = ?";
  connection.query(sql, [status, orderId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (status === "1") {
        res.status(200).json({ message: "Order Declined successfully" });
      } else {
        res
          .status(200)
          .json({ message: "Order Sent to Label team successfully" });
      }
    }
  });
});

export const AdminUpdateOrderquantity = CatchAsyncError((req, res) => {
  const orderId = req.params.id;
  const { quantity_received, unit } = req.body;
  // Check if quantity_received is equal to unit
  const updatedStatus = quantity_received == unit ? 2 : 0;
  // Update status and quantity_received in the database
  const sql =
    "UPDATE order_table SET status = ?, quantity_received = ? WHERE id = ?";

  connection.query(
    sql,
    [updatedStatus, quantity_received, orderId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({
          message: "Order status and quantity received updated successfully",
        });
      }
    }
  );
});

export const AdminGetSpecificOrderDetails = CatchAsyncError(
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
              }

              const sql = `
              SELECT orderServices.*, productservice.category
              FROM orderServices
              JOIN productservice ON orderServices.services = productservice.id
              WHERE orderServices.orderId = ?
 
              `;
              connection.query(sql, orderId, (err, productresults) => {
                if (err) {
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

                  productresults.forEach((service) => {
                    if (service.category === "Product") {
                      responseData.services.Products.push(service);
                    } else {
                      responseData.services.Services.push(service);
                    }
                  });

                  res.status(200).json(responseData);
                }
              });
            }
          );
        }
      }
    });
  }
);

export const GetOrders = CatchAsyncError(async (req, res) => {
  const status = req.params.status;
  if (!status) {
    return res
      .status(400)
      .json({ error: "Status is required in the request body" });
  }
  let sql;
  let queryParameters;

  if (status === "9") {
    sql = "SELECT * FROM order_table WHERE status < ? ORDER BY id DESC";
    queryParameters = [9];
  } else {
    sql = "SELECT * FROM order_table WHERE status = ? ORDER BY id DESC";
    queryParameters = [status];
  }
  connection.query(sql, queryParameters, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ results: results }); // Send the fetched data as a response
    }
  });
});

export const dimensionUpdate = CatchAsyncError(async (req, res, next) => {
  try {
    const { length, width, height, weight } = req.body;
    const req_id = req.user.id;
    const id = req.params.id; // Assuming you get the ID from the request parameters

    // Update the record in  the order_table
    connection.query(
      "UPDATE order_table SET byid=?,length = ?, width = ?, height = ?, weight = ?,status=? WHERE id = ?",
      [req_id, length, width, height, weight, 3, id],
      (error) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        res.status(200).json({
          success: true,
          message: "Dimension Updated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const dimensionOrderList = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM order_table WHERE status= 2 ORDER BY id DESC",
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length === 0) {
          return next(new ErrorHandler("No Orders", 400));
        }
        const data = results;

        res.status(200).json({
          success: true,
          message: "Orders",
          data,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const labelOrderList = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM order_table WHERE status= 3 ORDER BY id DESC",
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }
        if (results.length === 0) {
          return next(new ErrorHandler("No Orders", 400));
        }
        const data = results;
        res.status(200).json({
          success: true,
          message: "label Orders",
          data,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const labelUpdate = CatchAsyncError(async (req, res, next) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const req_id = req.user.id;
    let status1;
    if (status === true) {
      status1 = 4;
    } else {
      status1 = 3;
      return next(new ErrorHandler("Please Select The Check box", 500));
    }
    connection.query(
      "UPDATE order_table SET byid=?,fnsku_label_printed = ?,status=? WHERE id = ?",
      [req_id, status, status1, id],
      (error) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        res.status(200).json({
          success: true,
          message: "Label Updated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const AccountOrders = CatchAsyncError(async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM order_table WHERE status = 4 ORDER BY id DESC",
      async (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500)); // Handle database query error
        }

        if (results.length === 0) {
          return next(new ErrorHandler("No Orders", 400));
        }
        const data = results;

        res.status(200).json({
          success: true,
          message: "Orders",
          data,
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const AdminUpdateOrderDetail = CatchAsyncError(
  async (req, res, next) => {
    const orderId = req.params.id;
    let count;
    try {
      const {
        name,
        service,
        product,
        unit,
        tracking_url,
        length,
        width,
        height,
        weight,
        status,
        instructions,
        selectedProducts,
        quantity_received,
      } = req.body;
      const parsedProducts = JSON.parse(selectedProducts);
      const fnskuFiles = req.files["fnskuSendFiles"];
      const labelFiles = req.files["labelSendFiles"];
      connection.query(
        `UPDATE order_table SET
        name = ?,
        service = ?,
        product = ?,
        unit = ?,
        tracking_url = ?,
        length = ?,
        width = ?,
        height = ?,
        weight = ?,
        status = ?,
        instructions = ?,
        quantity_received=?
        WHERE id = ?`,
        [
          name,
          service,
          product,
          unit,
          tracking_url,
          length,
          width,
          height,
          weight,
          status,
          instructions,
          quantity_received,
          orderId,
        ],
        (error, results) => {
          if (error) {
            return next(new ErrorHandler(error.message, 500));
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
      connection.query(
        selectQuery,
        [orderId, name],
        (selectError, filesData) => {
          if (selectError) {
            return callback(selectError);
          }
          const count = filesData.length > 0 ? true : false;
          const updateQuery = `UPDATE order_table SET ${columnName} = ? WHERE id = ?`;
          connection.query(updateQuery, [count, orderId], (updateError) => {
            if (updateError) {
            }
          });
        }
      );
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
  }
);
export const AmountUpdate = CatchAsyncError(async (req, res, next) => {
  try {
    const { amount } = req.body;
    const id = req.params.id;
    const req_id = req.user.id;

    connection.query(
      "UPDATE order_table SET byid=?,amount = ?,status=?,invoice=? WHERE id = ?",
      [req_id, amount, 5, true, id],
      (error) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        res.status(200).json({
          success: true,
          message: "Invoice generated successfully",
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const CreateDimension = CatchAsyncError((req, res, next) => {
  const id = req.params.id;
  const { length, width, height, weight, itemNo, boxBy } = req.body;
  const query = `
    INSERT INTO dimension (orderID, length, width, height, weight, itemNo, boxBy)
    VALUES (?, ?, ?, ?, ?, ?, ?);`;
  const values = [id, length, width, height, weight, itemNo, boxBy];

  connection.query(query, values, (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message, 400));
    }
    res.status(201).json({
      success: true,
      message: "Dimension record created successfully",
      createdDimension: result,
    });
  });
});

export const GetDimensionsByOrderId = CatchAsyncError((req, res, next) => {
  const orderId = req.params.id;
  const query = `
    SELECT * FROM dimension
    WHERE orderId = ? ORDER BY id DESC;`;
  const values = [orderId];
  connection.query(query, values, (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    res.status(200).json({
      dimensions: result,
      success: true,
    });
  });
});

export const UpdateDimensionById = CatchAsyncError((req, res, next) => {
  const id = req.params.id;
  const { length, width, height, weight, itemNo, boxBy } = req.body;

  const query = `
    UPDATE dimension
    SET length = ?, width = ?, height = ?, weight = ?, itemNo = ?, boxBy = ?
    WHERE id = ?`;
  const values = [length, width, height, weight, itemNo, boxBy, id];
  connection.query(query, values, (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message, 400));
    }
    res.status(200).json({
      success: true,
      message: "Dimension record updated successfully",
    });
  });
});

export const updateServiceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updateQuery = "UPDATE productservice SET status = ? WHERE id = ?";

  connection.query(updateQuery, [status, parseInt(id)], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Status updated successfully" });
    }
  });
};

function mergeOrdersWithServices(orders) {
  const mergedOrders = orders.reduce((acc, order) => {
    const foundOrder = acc.find((o) => o.id === order.id);

    if (foundOrder) {
      foundOrder.services.push({
        serviceId: order.serviceId,
        productName: order.productName,
        productCategory: order.productCategory,
        productPrice: order.productPrice,
        serviceQuantity: order.serviceQuantity, // Include serviceQuantity
      });
    } else {
      acc.push({
        id: order.id,
        byid: order.byid,
        status: order.status,
        name: order.name,
        customer_name: order.customer_name,
        date: order.date,
        service: order.service,
        product: order.product,
        unit: order.unit,
        tracking_url: order.tracking_url,
        recived: order.recived,
        length: order.length,
        width: order.width,
        height: order.height,
        weight: order.weight,
        fnsku: order.fnsku,
        fnsku_status: order.fnsku_status,
        label: order.label,
        label_status: order.label_status,
        fnsku_label_printed: order.fnsku_label_printed,
        customer_id: order.customer_id,
        invoice: order.invoice,
        amount: order.amount,
        drop_off: order.drop_off,
        payment_status: order.payment_status,
        instructions: order.instructions,
        services: [
          {
            serviceId: order.serviceId,
            productName: order.productName,
            productCategory: order.productCategory,
            productPrice: order.productPrice,
            serviceQuantity: order.serviceQuantity, // Include serviceQuantity
          },
        ],
      });
    }

    return acc;
  }, []);

  return mergedOrders;
}

export const generateInvoices = CatchAsyncError(async (req, res, next) => {
  try {
    const { selectedIds } = req.body;
    connection.query(
      `SELECT customer_id FROM order_table WHERE id IN (?)`,
      [selectedIds],
      (error, results) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        const customerIds = results.map((result) => result.customer_id);

        const areAllSame = customerIds.every((id) => id === customerIds[0]);

        if (!areAllSame) {
          return next(new ErrorHandler("They are not the same customer", 400));
        }

        // Your second query to join order_table and orderServices
        const secondQuery = `
      SELECT order_table.*,
            orderServices.services AS serviceId,
            orderServices.quantity AS serviceQuantity,
            productservice.name AS productName,
            productservice.category AS productCategory,
            productservice.price AS productPrice
      FROM order_table
      LEFT JOIN orderServices ON order_table.id = orderServices.orderId
      LEFT JOIN productservice ON orderServices.services = productservice.id
      WHERE order_table.id IN (?)
    `;

        connection.query(secondQuery, [selectedIds], (err, secondResults) => {
          if (err) {
            return next(new ErrorHandler(err.message, 400));
          }

          const orders = mergeOrdersWithServices(secondResults);
          res.status(200).json({
            success: true,
            message: "Successfully fetched Invoice data",
            orders,
          });
        });
      }
    );
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const postgenerateInvoice = CatchAsyncError(async (req, res) => {
  const {
    customer_id,
    orders,
    discount,
    totalamount,
    invoice_status,
    discounted_amount,
  } = req.body;

  const query =
    "INSERT INTO invoiceTable (customer_id, orders, discount, totalamount,discounted_amount, invoice_status) VALUES (?, ?, ?, ?,?, ?)";
  const values = [
    customer_id,
    orders,
    discount,
    totalamount,
    discounted_amount,
    invoice_status,
  ];
  const parsedOrderIds = JSON.parse(orders);
  try {
    await Promise.all(
      parsedOrderIds.map(async (orderId) => {
        await new Promise((resolve, reject) => {
          connection.query(
            "UPDATE order_table SET status=? WHERE id = ?",
            [5, orderId],
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
    connection.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).send("Error inserting data into the database");
      }
      res.status(201).send("Invoice created successfully");
    });
  } catch {}
});

export const UpdateDiscount = CatchAsyncError((req, res, next) => {
  const id = req.params.id;
  // Fetch invoice details
  const selectQuery = `
    SELECT * FROM invoiceTable WHERE id=?`;

  connection.query(selectQuery, [id], (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message, 400));
    }

    if (result.length === 0) {
      return next(new ErrorHandler("Order not Found", 400));
    }

    // Calculate discount and final price based on your logic
    const discount = req.body.discount; // You should validate and sanitize this value
    const totalAmount = result[0].totalamount; // Replace 'totalAmount' with your actual column name
    const finalPrice = totalAmount - (totalAmount * discount) / 100;

    if (result[0].invoice_status != 5) {
      return next(
        new ErrorHandler(
          "Invoice is not in Invoice Generated State. You can't change",
          400
        )
      );
    }

    // Update invoice table with discount and final price
    const updateQuery = `
      UPDATE invoiceTable 
      SET discount = ?, discounted_amount = ? 
      WHERE id = ?`;

    connection.query(
      updateQuery,
      [discount, finalPrice, id],
      (error, updatedResult) => {
        if (error) {
          return next(new ErrorHandler(error.message, 400));
        }

        res.status(200).json({
          success: true,
          message: "Discount and final price updated successfully",
        });
      }
    );
  });
});

export const getInvoices = CatchAsyncError(async (req, res) => {
  const status = req.params.id;
  const customer_id = req.user.id;
  let query;
  if (status === "6") {
    query =
      "SELECT * FROM invoiceTable WHERE customer_id = ? AND (invoice_status = 6 OR invoice_status = 8) ORDER BY id DESC";
  } else {
    query =
      "SELECT * FROM invoiceTable WHERE customer_id = ? AND invoice_status = ? ORDER BY id DESC";
  }

  connection.query(query, [customer_id, status], (error, results) => {
    if (error) {
      return res.status(500).send("Error fetching data from the database");
    }
    res.status(200).json(results);
  });
});

export const deleteDimension = CatchAsyncError(async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM dimension WHERE id = ?";
  // Execute the query
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).send("Error fetching data from the database");
    }
    res.status(200).json("Deleted Successfully");
  });
});
