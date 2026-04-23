const { asyncHandler, apiResponse } = require("../utils/helpers");
const mlService = require("../services/ml.service");
const weatherService = require("../services/weather.service");

const postDelayPrediction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (payload.lat && payload.lon) {
    const weather = await weatherService.getWeather(payload.lat, payload.lon);
    payload.weather = weather;
  }

  const prediction = await mlService.predictDelay(payload);
  return apiResponse(res, prediction, "Delay prediction generated");
});

module.exports = {
  postDelayPrediction
};
