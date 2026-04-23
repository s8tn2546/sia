const { StatusCodes } = require("http-status-codes");
const { asyncHandler, apiResponse } = require("../utils/helpers");
const Inventory = require("../models/inventory.model");
const Transaction = require("../models/transaction.model");
const { TRANSACTION_TYPES } = require("../utils/constants");

const postSupply = asyncHandler(async (req, res) => {
  const { sku, productName, warehouse, quantity, unitCost } = req.body;

  if (!sku || !productName || !warehouse || !quantity) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "sku, productName, warehouse and quantity are required"
    });
  }

  const inventory = await Inventory.findOneAndUpdate(
    { sku },
    {
      $setOnInsert: { sku, productName, warehouse, unitCost: unitCost || 0 },
      $inc: { quantity: Number(quantity) }
    },
    { new: true, upsert: true }
  );

  await Transaction.create({
    inventory: inventory._id,
    type: TRANSACTION_TYPES.SUPPLY,
    quantity: Number(quantity),
    note: "Supply received",
    metadata: { unitCost: unitCost || 0 }
  });

  return apiResponse(res, inventory, "Supply updated", StatusCodes.CREATED);
});

module.exports = {
  postSupply
};
