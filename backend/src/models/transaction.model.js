const mongoose = require("mongoose");
const { TRANSACTION_TYPES } = require("../utils/constants");

const transactionSchema = new mongoose.Schema(
  {
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
    type: { type: String, enum: Object.values(TRANSACTION_TYPES), required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
