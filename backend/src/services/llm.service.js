const axios = require("axios");
const env = require("../config/env");

const llmApi = axios.create({
  baseURL: env.fastApiBaseUrl,
  timeout: 20000
});

// Add response interceptor for better error messages
llmApi.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(`[LLM Service] Cannot connect to FastAPI at ${env.fastApiBaseUrl}`);
      throw new Error(`FastAPI service unreachable at ${env.fastApiBaseUrl}. Check FASTAPI_BASE_URL environment variable.`);
    }
    throw error;
  }
);

const askChatbot = async (payload) => {
  const { data } = await llmApi.post("/chat", payload);
  return data;
};

const getInsights = async (payload = {}) => {
  const { data } = await llmApi.post("/insights", payload);
  return data;
};

module.exports = {
  askChatbot,
  getInsights
};
