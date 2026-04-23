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
  const userId = req.user.id;
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
  const normalizedSku = String(sku || "").trim().toUpperCase();
  const normalizedProductName = String(productName || "").trim();
  const normalizedWarehouse = String(warehouse || "").trim();
  const normalizedOrigin = String(origin || normalizedWarehouse).trim();
  const normalizedDestination = String(destination || "TBD").trim();

  if (!normalizedSku || !normalizedProductName || !normalizedWarehouse || !quantity) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "sku, productName, warehouse and quantity are required"
    });
  }

  const inventory = await Inventory.findOneAndUpdate(
    { userId, sku: normalizedSku },
    {
      $setOnInsert: {
        userId,
        sku: normalizedSku
      },
      $set: {
        productName: normalizedProductName,
        warehouse: normalizedWarehouse,
        unitCost: unitCost || 0
      },
      $inc: { quantity: Number(quantity) }
    },
    { new: true, upsert: true }
  );

  const transaction = await Transaction.create({
    userId,
    inventory: inventory._id,
    type: TRANSACTION_TYPES.SUPPLY,
    quantity: Number(quantity),
    note: "Supply received",
    metadata: {
      unitCost: unitCost || 0,
      origin: normalizedOrigin,
      destination: normalizedDestination,
      mode: mode || "ground",
      routeOption: routeOption || null
    }
  });

  const shipment = await Shipment.create({
    userId,
    trackingId: buildTrackingId(),
    transactionId: String(transaction._id),
    origin: normalizedOrigin,
    destination: normalizedDestination,
    status: SHIPMENT_STATUS.CREATED,
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    checkpoints: [
      {
        location: normalizedOrigin,
        status: SHIPMENT_STATUS.CREATED
      }
    ]
  });

  transaction.shipment = shipment._id;
  await transaction.save();

  await Notification.create({
    userId,
    type: "success",
    title: "Supply Recorded",
    message: `${normalizedProductName} supply saved. Tracking ID ${shipment.trackingId}`,
    metadata: {
      transactionId: String(transaction._id),
      trackingId: shipment.trackingId,
      sku: normalizedSku
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
