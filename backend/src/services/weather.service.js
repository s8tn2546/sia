const axios = require("axios");
const env = require("../config/env");

const weatherApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 10000
});

const getWeather = async (lat, lon) => {
  const { data } = await weatherApi.get("/weather", {
    params: { lat, lon }
  });
  return data;
};

module.exports = {
  getWeather
};
