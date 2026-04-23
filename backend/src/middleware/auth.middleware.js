const { StatusCodes } = require("http-status-codes");
const env = require("../config/env");

const parseJwtPayload = (token) => {
  const parts = String(token || "").split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const hasAuthHeader = Boolean(token);

  const bearerToken = typeof token === "string" && token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  const payload = parseJwtPayload(bearerToken);

  if (payload) {
    req.user = {
      id: String(payload.user_id || payload.sub || payload.uid || "anonymous"),
      email: payload.email || null,
      name: payload.name || payload.display_name || null,
      role: "user"
    };

    return next();
  }

  if (hasAuthHeader && env.nodeEnv === "production") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    });
  }

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
