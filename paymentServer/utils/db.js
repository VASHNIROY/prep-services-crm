const mysql = require("mysql");

// Set up MySQL database connection
exports.connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "prepdatabase",
});
