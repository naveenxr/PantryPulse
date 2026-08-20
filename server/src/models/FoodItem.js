const mongoose = require("mongoose");

/**
 * FoodItem Schema
 * Structure for tracking food inventory items in Indian households.
 */
const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    expiryDate: {
      type: Date,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["fresh", "expiring_soon", "expired", "consumed", "wasted"],
      default: "fresh",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
