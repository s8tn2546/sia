const dotenv = require("dotenv");

dotenv.config();

const required = ["MONGO_URI", "FASTAPI_BASE_URL", "PORT"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Normalize FASTAPI_BASE_URL: remove trailing slash
const normalizeUrl = (url) => {
  return url.replace(/\/$/, "");
};

const fastApiBaseUrl = normalizeUrl(process.env.FASTAPI_BASE_URL);

// Validate URL format
try {
  new URL(fastApiBaseUrl);
} catch (err) {
  throw new Error(`Invalid FASTAPI_BASE_URL: ${fastApiBaseUrl}. Must be a valid URL (e.g., http://localhost:8000 or https://service.onrender.com)`);
}

console.log(`[ENV] Using FASTAPI_BASE_URL: ${fastApiBaseUrl}`);

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  fastApiBaseUrl,
  jwtSecret: process.env.JWT_SECRET || "change_me"
};
