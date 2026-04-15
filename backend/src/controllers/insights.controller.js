const { asyncHandler, apiResponse } = require("../utils/helpers");
const llmService = require("../services/llm.service");

const getInsights = asyncHandler(async (req, res) => {
  const insights = await llmService.getInsights();
  return apiResponse(res, insights, "Insights fetched");
});

module.exports = {
  getInsights
};
