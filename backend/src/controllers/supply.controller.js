const { StatusCodes } = require("http-status-codes");
const { asyncHandler, apiResponse } = require("../utils/helpers");
const Inventory = require("../models/inventory.model");
const Transaction = require("../models/transaction.model");
const Shipment = require("../models/shipment.model");
const Notification = require("../models/notification.model");
const { SHIPMENT_STATUS } = require("../utils/constants");
const { TRANSACTION_TYPES } = require("../utils/constants");

const buildTrackingId = () => `SH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const postSupply = asyncHandler(async (req, res) => {
  const {
    sku,
    productName,
    warehouse,
    quantity,
    unitCost,
    origin,
    destination,
    mode,
    routeOption
  } = req.body;

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

  const transaction = await Transaction.create({
    inventory: inventory._id,
    type: TRANSACTION_TYPES.SUPPLY,
    quantity: Number(quantity),
    note: "Supply received",
    metadata: {
      unitCost: unitCost || 0,
      origin: origin || warehouse,
      destination: destination || "TBD",
      mode: mode || "ground",
      routeOption: routeOption || null
    }
  });

  const shipment = await Shipment.create({
    trackingId: buildTrackingId(),
    transactionId: String(transaction._id),
    origin: origin || warehouse,
    destination: destination || "TBD",
    status: SHIPMENT_STATUS.CREATED,
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    checkpoints: [
      {
        location: origin || warehouse,
        status: SHIPMENT_STATUS.CREATED
      }
    ]
  });

  transaction.shipment = shipment._id;
  await transaction.save();

  await Notification.create({
    type: "success",
    title: "Supply Recorded",
    message: `${productName} supply saved. Tracking ID ${shipment.trackingId}`,
    metadata: {
      transactionId: String(transaction._id),
      trackingId: shipment.trackingId,
      sku
    }
  });

  return apiResponse(
    res,
    {
      inventory,
      transactionId: String(transaction._id),
      trackingId: shipment.trackingId,
      shipmentId: String(shipment._id)
    },
    "Supply updated",
    StatusCodes.CREATED
  );
});

module.exports = {
  postSupply
};
