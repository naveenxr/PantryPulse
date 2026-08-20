const { calculateFreshness } = require("./freshnessService");
const { calculatePriority } = require("./priorityService");

/**
 * Enriches a single food item document with calculated freshness and priority intelligence.
 * @param {Object} itemDoc - Mongoose document or plain JS object
 * @returns {Object} Enriched food item
 */
const enrichFoodItem = (itemDoc) => {
  if (!itemDoc) return null;

  const itemObj = typeof itemDoc.toObject === "function" ? itemDoc.toObject() : { ...itemDoc };
  const freshness = calculateFreshness(itemObj);
  const priority = calculatePriority(freshness, itemObj.estimatedPrice);

  return {
    ...itemObj,
    freshness,
    priority,
  };
};

/**
 * Enriches an array of food item documents.
 * @param {Array} items - Array of food items
 * @returns {Array} Enriched food items
 */
const enrichFoodItems = (items = []) => {
  return items.map((item) => enrichFoodItem(item));
};

module.exports = {
  enrichFoodItem,
  enrichFoodItems,
};
