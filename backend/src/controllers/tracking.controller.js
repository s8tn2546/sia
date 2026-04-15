const { StatusCodes } = require("http-status-codes");
const { asyncHandler, apiResponse } = require("../utils/helpers");
const Shipment = require("../models/shipment.model");

const getTracking = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findOne({ trackingId: req.params.id }).lean();

  if (!shipment) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Shipment not found"
    });
  }

  return apiResponse(res, shipment, "Tracking details fetched");
});

module.exports = {
  getTracking
};
