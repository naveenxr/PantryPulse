/**
 * Pantry Context Builder Service
 * Dynamically converts real database FoodItem records into structured pantry context
 * for Gemini AI system prompts.
 */

/**
 * Calculates remaining shelf life days from purchase date and shelf life
 */
const calculateDaysRemaining = (purchaseDate, shelfLifeDays) => {
  if (!purchaseDate || !shelfLifeDays) return 30;
  const pDate = new Date(purchaseDate).getTime();
  const expiryTime = pDate + shelfLifeDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
};

/**
 * Capitalizes category names nicely
 */
const formatCategory = (cat) => {
  if (!cat) return "Other";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
};

/**
 * Builds structured pantry context from MongoDB FoodItem documents
 * @param {Array} foods - List of active food items from database
 * @returns {Object} { contextText, metadata }
 */
const buildPantryContext = (foods = []) => {
  const activeFoods = Array.isArray(foods) ? foods.filter((f) => !f.isConsumed) : [];

  if (activeFoods.length === 0) {
    return {
      contextText: `CURRENT PANTRY INVENTORY:\n\nYour pantry is currently empty. Add or scan some ingredients and I can suggest meals for you.`,
      metadata: {
        availableItems: 0,
        expiringSoon: 0,
        lowStock: 0,
        expired: 0,
      },
    };
  }

  const availableItems = [];
  const expiringSoonItems = [];
  const expiredItems = [];
  const lowStockItems = [];

  activeFoods.forEach((item) => {
    const daysRemaining = calculateDaysRemaining(item.purchaseDate, item.shelfLifeDays);
    const cat = formatCategory(item.category);
    const qtyText = `${item.quantity} ${item.unit || "pcs"}`;

    if (daysRemaining <= 0) {
      expiredItems.push(`- ${item.name} | ${qtyText} | ${cat} (EXPIRED ${Math.abs(daysRemaining)} days ago)`);
    } else {
      availableItems.push(`- ${item.name} | ${qtyText} | ${cat}`);

      if (daysRemaining <= 3) {
        expiringSoonItems.push(`- ${item.name} | ${qtyText} | expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`);
      }
    }

    if (item.quantity <= 1) {
      lowStockItems.push(`- ${item.name} | ${qtyText} remaining`);
    }
  });

  const availableStr = availableItems.length > 0 ? availableItems.join("\n") : "- None";
  const expiringStr = expiringSoonItems.length > 0 ? expiringSoonItems.join("\n") : "- None";
  const lowStockStr = lowStockItems.length > 0 ? lowStockItems.join("\n") : "- None";
  const expiredStr = expiredItems.length > 0 ? expiredItems.join("\n") : "- None";

  const contextText = `CURRENT PANTRY INVENTORY:

AVAILABLE ITEMS:
${availableStr}

EXPIRING SOON:
${expiringStr}

LOW STOCK:
${lowStockStr}

EXPIRED:
${expiredStr}`;

  return {
    contextText,
    metadata: {
      availableItems: availableItems.length,
      expiringSoon: expiringSoonItems.length,
      lowStock: lowStockItems.length,
      expired: expiredItems.length,
    },
  };
};

module.exports = {
  buildPantryContext,
  calculateDaysRemaining,
};
