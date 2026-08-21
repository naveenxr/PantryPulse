const express = require("express");
const router = express.Router();
const {
  createFood,
  getFoods,
  getFoodById,
  getUseFirstFoods,
  updateFood,
  deleteFood,
  consumeFood,
} = require("../controllers/foodController");

const { scanFoodImage } = require("../controllers/cvController");

// Base path: /api/foods

// Scan & collection routes
router.post("/scan", scanFoodImage);
router.post("/", createFood);
router.get("/", getFoods);

// Intelligence route (must be declared before generic /:id route)
router.get("/use-first", getUseFirstFoods);

// Action route
router.patch("/:id/consume", consumeFood);

// Generic document routes
router.get("/:id", getFoodById);
router.patch("/:id", updateFood);
router.delete("/:id", deleteFood);

module.exports = router;
