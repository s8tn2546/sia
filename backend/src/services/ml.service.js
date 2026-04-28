const axios = require("axios");
const env = require("../config/env");

const mlApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 15000
});

// Add response interceptor for better error messages
mlApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(`[ML Service] Cannot connect to FastAPI at ${env.fastApiBaseUrl}`);
      throw new Error(`FastAPI service unreachable at ${env.fastApiBaseUrl}. Check FASTAPI_BASE_URL environment variable.`);
    }
    throw error;
  }
);

const getDemandForecast = async () => {
  const { data } = await mlApi.get("/predict-demand");
  return data;
};

const predictDelay = async (payload) => {
  const { data } = await mlApi.post("/predict-delay", payload);
  return data;
};

module.exports = {
  getDemandForecast,
  predictDelay
};
