const { generateOpenRouterResponse } = require("../services/openRouterService");
const { buildPantryContext } = require("../services/pantryContextService");
const FoodItem = require("../models/FoodItem");

/**
 * @desc    Chat with Pantry AI powered by OpenRouter API
 * @route   POST /api/ai/chat
 * @access  Public
 */
const chatWithPantryAI = async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const cleanMessage = message.trim();
    console.log(`[Pantry AI] Received OpenRouter chat request: "${cleanMessage}"`);

    // Fetch REAL active pantry items from MongoDB database with safety fallback
    let activeFoods = [];
    try {
      activeFoods = await FoodItem.find({ isConsumed: false }).sort({ createdAt: -1 });
      console.log(`[Pantry AI] Fetched ${activeFoods.length} active database items`);
    } catch (dbErr) {
      console.error("[Pantry AI DB Warning]:", dbErr.message);
      activeFoods = [];
    }

    // Build dynamic pantry context & metadata
    const { contextText, metadata } = buildPantryContext(activeFoods);

    // Generate OpenRouter AI response
    const reply = await generateOpenRouterResponse(cleanMessage, contextText);

    return res.status(200).json({
      success: true,
      reply,
      response: reply,
      metadata: {
        availableItems: metadata.availableItems,
        expiringSoon: metadata.expiringSoon,
        lowStock: metadata.lowStock,
        expired: metadata.expired,
      },
    });
  } catch (error) {
    console.error("[AI Controller Exception]:", error.message || error);
    const fallbackText = "I'm having trouble connecting to Pantry AI right now. Please check your internet connection or try again in a moment.";
    return res.status(200).json({
      success: true,
      reply: fallbackText,
      response: fallbackText,
    });
  }
};

module.exports = {
  chatWithPantryAI,
  handleChat: chatWithPantryAI,
};
