const { StatusCodes } = require("http-status-codes");
const env = require("../config/env");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token && env.nodeEnv === "production") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    });
  }

  req.user = {
    id: "dev-user",
    role: "admin"
  };

  return next();
};

module.exports = authMiddleware;
