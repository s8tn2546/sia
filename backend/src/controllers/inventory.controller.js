const { asyncHandler, apiResponse } = require("../utils/helpers");
const Inventory = require("../models/inventory.model");
const Notification = require("../models/notification.model");

const getInventory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { lowStock } = req.query;
  const filter = { userId };

  if (String(lowStock).toLowerCase() === "true") {
    filter.$expr = { $lte: ["$quantity", "$reorderLevel"] };
  }

  const items = await Inventory.find(filter).sort({ updatedAt: -1 }).lean();
  return apiResponse(res, items, "Inventory fetched");
});

const postInventory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { sku, productName, quantity, reorderLevel, warehouse, unitCost } = req.body;
  const normalizedSku = String(sku || "").trim().toUpperCase();
  const normalizedProductName = String(productName || "").trim();
  const normalizedWarehouse = String(warehouse || "").trim();

  const item = await Inventory.create({
    userId,
    sku: normalizedSku,
    productName: normalizedProductName,
    quantity: Number(quantity || 0),
    reorderLevel: Number(reorderLevel || 20),
    warehouse: normalizedWarehouse,
    unitCost: Number(unitCost || 0)
  });

  if (item.quantity <= item.reorderLevel) {
    await Notification.create({
      userId,
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
