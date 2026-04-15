const { asyncHandler, apiResponse } = require("../utils/helpers");
const mapsService = require("../services/maps.service");

const estimateCheapestRoute = (routes, fuelPricePerKm = 0.12) => {
  if (!Array.isArray(routes) || routes.length === 0) {
    return null;
  }

  const withCost = routes.map((route) => {
    const distanceKm = Number(route.distanceKm || 0);
    const tolls = Number(route.tolls || 0);
    const estimatedCost = Number((distanceKm * fuelPricePerKm + tolls).toFixed(2));
    return { ...route, estimatedCost };
  });

  return withCost.reduce((min, route) =>
    route.estimatedCost < min.estimatedCost ? route : min
  );
};

const postRoutes = asyncHandler(async (req, res) => {
  const response = await mapsService.optimizeRoutes(req.body);
  const routes = response.routes || [];
  const cheapest = estimateCheapestRoute(routes, req.body.fuelPricePerKm);

  return apiResponse(res, { ...response, cheapestRoute: cheapest }, "Routes generated");
});

module.exports = {
  postRoutes
};
