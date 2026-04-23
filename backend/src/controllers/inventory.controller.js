const { asyncHandler, apiResponse } = require("../utils/helpers");
const Inventory = require("../models/inventory.model");
const Notification = require("../models/notification.model");

const getInventory = asyncHandler(async (req, res) => {
  const { lowStock } = req.query;
  const filter = {};

  if (String(lowStock).toLowerCase() === "true") {
    filter.$expr = { $lte: ["$quantity", "$reorderLevel"] };
  }

  const items = await Inventory.find(filter).sort({ updatedAt: -1 }).lean();
  return apiResponse(res, items, "Inventory fetched");
});

const postInventory = asyncHandler(async (req, res) => {
  const { sku, productName, quantity, reorderLevel, warehouse, unitCost } = req.body;

  const item = await Inventory.create({
    sku,
    productName,
    quantity: Number(quantity || 0),
    reorderLevel: Number(reorderLevel || 20),
    warehouse,
    unitCost: Number(unitCost || 0)
  });

  if (item.quantity <= item.reorderLevel) {
    await Notification.create({
      type: "warning",
      title: "Low Stock Alert",
      message: `${item.productName} (${item.sku}) is at or below reorder level.`,
      metadata: {
        sku: item.sku,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel
      }
    });
  }

  return apiResponse(res, item, "Inventory item created", 201);
});

module.exports = {
  getInventory,
  postInventory
};
