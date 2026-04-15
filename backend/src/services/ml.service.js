const axios = require("axios");
const env = require("../config/env");

const mlApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 15000
});

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
