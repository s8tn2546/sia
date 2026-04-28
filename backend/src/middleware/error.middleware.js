const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res) => {
  console.warn(`[404] Endpoint not found: ${req.method} ${req.path}`);
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  });
};

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  // Log errors for debugging
  if (status >= 500) {
    console.error(`[ERROR] ${status}: ${message}`, err);
  } else {
    console.warn(`[WARN] ${status}: ${message}`);
  }

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
