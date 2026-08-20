const mongoose = require("mongoose");

/**
 * FoodItem Schema
 * Manages food inventory items for Indian households.
 */
const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "vegetable",
          "fruit",
          "dairy",
          "meat",
          "cooked-food",
          "grain",
          "pulse",
          "packaged",
          "other",
        ],
        message: "{VALUE} is not a valid food category",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
      default: Date.now,
    },
    shelfLifeDays: {
      type: Number,
      required: [true, "Shelf life in days is required"],
      min: [1, "Shelf life must be at least 1 day"],
    },
    storageType: {
      type: String,
      required: [true, "Storage type is required"],
      enum: {
        values: ["room", "refrigerator", "freezer"],
        message: "{VALUE} is not a valid storage type",
      },
    },
    estimatedPrice: {
      type: Number,
      default: 0,
      min: [0, "Estimated price cannot be negative"],
    },
    isConsumed: {
      type: Boolean,
      default: false,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
