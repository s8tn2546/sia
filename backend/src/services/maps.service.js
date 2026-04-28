const axios = require("axios");
const env = require("../config/env");

const mapsApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 15000
});

// Add response interceptor for better error messages
mapsApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(`[Maps Service] Cannot connect to FastAPI at ${env.fastApiBaseUrl}`);
      throw new Error(`FastAPI service unreachable at ${env.fastApiBaseUrl}. Check FASTAPI_BASE_URL environment variable.`);
    }
    throw error;
  }
);

const optimizeRoutes = async (payload) => {
  const { data } = await mapsApi.post("/routes", payload);
  return data;
};

module.exports = {
  optimizeRoutes
};
