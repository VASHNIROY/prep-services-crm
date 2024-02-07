import { createCustomerTable } from "./customerTable.js";
import { connection } from "../utils/db.js";
import { staffTable } from "./staffTable.js";
import { productTable } from "./productTable.js";
import { filesTable, orderTable } from "./orderTable.js";
import { TransactionTable } from "./transactionTable.js";
import { DimensionTable } from "./dimensionTabel.js";
import { productAndServicetable } from "./productservice.js";
import { orderServices } from "./orderServices.js";
import { InvoiceTable } from "./invoicetable.js";
const tablesToCreate = [
  {
    tableName: "createCustomerTable",
    sql: createCustomerTable,
  },
  {
    tableName: "staffTable",
    sql: staffTable,
  },
  {
    tableName: "productTable",
    sql: productTable,
  },
  {
    tableName: "orderTable",
    sql: orderTable,
  },
  {
    tableName: "transactionTable",
    sql: TransactionTable,
  },
  {
    tableName: "filesTable",
    sql: filesTable,
  },
  {
    tableName: "DimensionTable",
    sql: DimensionTable,
  },
  {
    tableName: "productAndServicetable",
    sql: productAndServicetable,
  },
  {
    tableName: "orderServices",
    sql: orderServices,
  },
  {
    tableName: "InvoiceTable",
    sql: InvoiceTable,
  },
];

export const createTables = () => {
  for (const table of tablesToCreate) {
    connection.query(table.sql, (err) => {
      if (err) throw err;
      console.log(`${table.tableName} table created successfully!`);
    });
  }
};
