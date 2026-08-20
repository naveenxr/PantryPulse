const mongoose = require("mongoose");
const FoodItem = require("../models/FoodItem");
const { enrichFoodItem, enrichFoodItems } = require("../services/foodIntelligenceService");

/**
 * Helper to validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Create a new food item
 * @route   POST /api/foods
 */
const createFood = async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    const enrichedFood = enrichFoodItem(food);
    return res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: {
        food: enrichedFood,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create food item",
    });
  }
};

/**
 * @desc    Get food items with calculated freshness & priority (unconsumed by default, optionally all)
 * @route   GET /api/foods
 */
const getFoods = async (req, res) => {
  try {
    const includeConsumed = req.query.includeConsumed === "true";
    const filter = includeConsumed ? {} : { isConsumed: false };

    const foods = await FoodItem.find(filter).sort({ createdAt: -1 });
    const enrichedFoods = enrichFoodItems(foods);

    return res.status(200).json({
      success: true,
      count: enrichedFoods.length,
      data: {
        foods: enrichedFoods,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve food items",
    });
  }
};

/**
 * @desc    Get single food item by ID with intelligence layer
 * @route   GET /api/foods/:id
 */
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID format",
      });
    }

    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const enrichedFood = enrichFoodItem(food);

    return res.status(200).json({
      success: true,
      data: {
        food: enrichedFood,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve food item",
    });
  }
};

/**
 * @desc    Get top priority "USE FIRST" food items sorted by priority score
 * @route   GET /api/foods/use-first
 */
const getUseFirstFoods = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const foods = await FoodItem.find({ isConsumed: false });
    const enrichedFoods = enrichFoodItems(foods);

    // Sort by priorityScore descending
    enrichedFoods.sort((a, b) => b.priority.priorityScore - a.priority.priorityScore);

    const topFoods = enrichedFoods.slice(0, limit);

    return res.status(200).json({
      success: true,
      count: topFoods.length,
      data: {
        foods: topFoods,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve use-first food items",
    });
  }
};

/**
 * @desc    Update a food item
 * @route   PATCH /api/foods/:id
 */
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID format",
      });
    }

    // Explicitly disallow modifying isConsumed and consumedAt directly via this route
    const updates = { ...req.body };
    delete updates.isConsumed;
    delete updates.consumedAt;

    const food = await FoodItem.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const enrichedFood = enrichFoodItem(food);

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: {
        food: enrichedFood,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update food item",
    });
  }
};

/**
 * @desc    Delete a food item
 * @route   DELETE /api/foods/:id
 */
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID format",
      });
    }

    const food = await FoodItem.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete food item",
    });
  }
};

/**
 * @desc    Mark a food item as consumed
 * @route   PATCH /api/foods/:id/consume
 */
const consumeFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid food item ID format",
      });
    }

    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    if (food.isConsumed) {
      return res.status(400).json({
        success: false,
        message: "Food item is already marked as consumed",
      });
    }

    food.isConsumed = true;
    food.consumedAt = new Date();
    await food.save();

    const enrichedFood = enrichFoodItem(food);

    return res.status(200).json({
      success: true,
      message: "Food item marked as consumed",
      data: {
        food: enrichedFood,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark food item as consumed",
    });
  }
};

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  getUseFirstFoods,
  updateFood,
  deleteFood,
  consumeFood,
};
