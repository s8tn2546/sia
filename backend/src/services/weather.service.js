const axios = require("axios");
const env = require("../config/env");

const weatherApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 10000
});

// Add response interceptor for better error messages
weatherApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(`[Weather Service] Cannot connect to FastAPI at ${env.fastApiBaseUrl}`);
      throw new Error(`FastAPI service unreachable at ${env.fastApiBaseUrl}. Check FASTAPI_BASE_URL environment variable.`);
    }
    throw error;
  }
);

const getWeather = async (lat, lon) => {
  const { data } = await weatherApi.get("/weather", {
    params: { lat, lon }
  });
  return data;
};

module.exports = {
  getWeather
};
