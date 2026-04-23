const { StatusCodes } = require("http-status-codes");
const { asyncHandler, apiResponse } = require("../utils/helpers");
const Shipment = require("../models/shipment.model");

const getTracking = asyncHandler(async (req, res) => {
  const id = String(req.params.id || "").trim();
  const shipment = await Shipment.findOne({
    $or: [{ trackingId: id }, { transactionId: id }]
  }).lean();

  if (!shipment) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Shipment not found for provided tracking ID or transaction ID"
    });
  }

  return apiResponse(res, shipment, "Tracking details fetched");
});

module.exports = {
  getTracking
};
