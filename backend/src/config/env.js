const dotenv = require("dotenv");

dotenv.config();

const required = ["MONGO_URI", "FASTAPI_BASE_URL", "PORT"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  fastApiBaseUrl: process.env.FASTAPI_BASE_URL,
  jwtSecret: process.env.JWT_SECRET || "change_me"
};
