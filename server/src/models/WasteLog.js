const mongoose = require("mongoose");

/**
 * WasteLog Schema
 * Tracks food waste incidents and estimated financial loss.
 */
const wasteLogSchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
    },
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    estimatedCostInr: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      default: "expired",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteLog", wasteLogSchema);
