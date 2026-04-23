const { StatusCodes } = require("http-status-codes");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const apiResponse = (res, data, message = "Success", status = StatusCodes.OK) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

module.exports = {
  asyncHandler,
  apiResponse
};
