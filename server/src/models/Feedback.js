const mongoose = require("mongoose");

/**
 * Feedback Schema for Computer Vision Model Training Dataset Collection
 */
const feedbackSchema = new mongoose.Schema(
  {
    scanId: { type: String, required: true, index: true },
    modelVersion: { type: String, default: "yolo-world-v1" },
    originalDetections: { type: Array, default: [] },
    confirmedItems: { type: Array, default: [] },
    userCorrections: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
