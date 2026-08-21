const mongoose = require("mongoose");

/**
 * User Schema for PantryPulse Authentication & User Profile
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    householdSize: { type: Number, default: 2 },
    dietaryPreference: { type: String, default: "Vegetarian" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
