const express = require("express");
const cors = require("cors");
exports.app = express();
exports.app.use(express.json());
exports.app.use(express.static("upload"));
exports.app.use(cors());

const bodyParser = require("body-parser");
const ErrorMiddleware = require("./middleware/error.js");
const { customerRouter } = require("./routes/customerRoute");

exports.app.use(express.urlencoded({ extended: true }));
exports.app.use(bodyParser.json());
exports.app.use("/api/v1", customerRouter);

exports.app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

exports.app.use(ErrorMiddleware);
