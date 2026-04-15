const { asyncHandler, apiResponse } = require("../utils/helpers");
const Inventory = require("../models/inventory.model");

const getInventory = asyncHandler(async (req, res) => {
  const { lowStock } = req.query;
  const filter = {};

  if (String(lowStock).toLowerCase() === "true") {
    filter.$expr = { $lte: ["$quantity", "$reorderLevel"] };
  }

  const items = await Inventory.find(filter).sort({ updatedAt: -1 }).lean();
  return apiResponse(res, items, "Inventory fetched");
});

module.exports = {
  getInventory
};
