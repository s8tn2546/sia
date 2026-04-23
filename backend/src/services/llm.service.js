const axios = require("axios");
const env = require("../config/env");

const llmApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 20000
});

const askChatbot = async (payload) => {
  const { data } = await llmApi.post("/chat", payload);
  return data;
};

const getInsights = async () => {
  const { data } = await llmApi.get("/insights");
  return data;
};

module.exports = {
  askChatbot,
  getInsights
};
