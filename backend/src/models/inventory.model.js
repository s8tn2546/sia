const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 20 },
    warehouse: { type: String, required: true },
    unitCost: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
