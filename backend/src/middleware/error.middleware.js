const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  });
};

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    details: err.details || undefined
  });
};

module.exports = {
  notFoundMiddleware,
  errorMiddleware
};
