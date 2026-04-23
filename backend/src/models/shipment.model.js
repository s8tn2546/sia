const mongoose = require("mongoose");
const { SHIPMENT_STATUS } = require("../utils/constants");

const checkpointSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: SHIPMENT_STATUS.IN_TRANSIT }
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    transactionId: { type: String, index: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    eta: { type: Date },
    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUS),
      default: SHIPMENT_STATUS.CREATED
    },
    checkpoints: { type: [checkpointSchema], default: [] },
    delayProbability: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
