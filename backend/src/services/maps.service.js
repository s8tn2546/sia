const axios = require("axios");
const env = require("../config/env");

const mapsApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 15000
});

const optimizeRoutes = async (payload) => {
  const { data } = await mapsApi.post("/routes", payload);
  return data;
};

module.exports = {
  optimizeRoutes
};
