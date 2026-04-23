const { asyncHandler, apiResponse } = require("../utils/helpers");
const mlService = require("../services/ml.service");

const getDemand = asyncHandler(async (req, res) => {
  const forecast = await mlService.getDemandForecast();
  return apiResponse(res, forecast, "Demand forecast fetched");
});

module.exports = {
  getDemand
};
