const app = require("./app.js").app;
const { connection } = require("./utils/db.js");

const port = 3008;

app.listen(port, () => {
  console.log("listening on port 3008");
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});
