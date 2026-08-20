/**
 * OpenRouter AI Service
 * Handles communication with OpenRouter API (Gemini, Llama, GPT models)
 * using system instructions and real database pantry context.
 */

const SYSTEM_INSTRUCTION = `You are PantryPulse AI, an intelligent pantry-aware cooking and household food assistant.

Your primary source of truth is the CURRENT PANTRY INVENTORY provided to you.

You help users:
- Decide what to cook
- Reduce food waste
- Prioritize ingredients expiring soon
- Use available pantry ingredients
- Understand what ingredients are missing
- Suggest meals based on available items
- Suggest what ingredients should be used first
- Help with low stock and shopping decisions

STRICT RULES:
1. Never claim that an ingredient is available unless it exists in the provided pantry context.
2. Always prioritize ingredients that are expiring soon when suggesting recipes.
3. Never invent quantities, expiry dates, or pantry items.
4. If a recipe requires ingredients that are not available, clearly list them as "Missing ingredients".
5. Prefer recipes that maximize the use of available pantry ingredients.
6. Keep answers practical, concise, and easy to follow.
7. When recommending a recipe, structure your answer clearly:

Recipe Name: [Name]

Uses from your pantry:
- [available ingredient]

Missing ingredients:
- [missing ingredient]

Cooking time:
- [approximate time]

Simple steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Why this is a good choice:
- [Explain why based on pantry availability or expiry]

8. If the user asks what they should use first, prioritize:
- Expiring soon items
- Perishable ingredients before long shelf-life ingredients
9. If the pantry is empty, clearly tell the user:
"Your pantry is currently empty. Add or scan some ingredients and I can suggest meals for you."
10. Do not pretend to know information that is not available.
11. You are a pantry-aware assistant, not a generic chatbot.
12. Answer naturally and conversationally.`;

/**
 * Generates an AI response using OpenRouter API
 * @param {string} userMessage - User query text
 * @param {string} pantryContext - Structured pantry context string
 * @returns {Promise<string>} Clean AI reply
 */
const generateOpenRouterResponse = async (userMessage, pantryContext) => {
  try {
    // Reload environment variables dynamically
    try {
      require("dotenv").config({ override: true });
    } catch (e) {}

    const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();

    if (!apiKey) {
      console.log("[OpenRouter Service] OPENROUTER_API_KEY environment variable is empty or missing.");
      return "Pantry AI is not configured yet. Please add OPENROUTER_API_KEY to your server/.env file.";
    }

    const primaryModel = (process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash").trim();
    const fallbackModels = [
      primaryModel,
      "google/gemini-2.5-flash",
      "google/gemini-flash-1.5",
      "meta-llama/llama-3.1-8b-instruct:free",
      "openai/gpt-4o-mini"
    ];

    const modelsToTry = Array.from(new Set(fallbackModels));

    for (const model of modelsToTry) {
      console.log(`[OpenRouter Service] Attempting AI request with model: ${model}`);
      const text = await callOpenRouterEndpoint(model, apiKey, pantryContext, userMessage);
      if (text) {
        console.log(`[OpenRouter Service] Response generated successfully using model: ${model}`);
        return text.trim();
      }
    }

    return "I couldn't generate an AI response right now. Please check your OpenRouter API key permissions or try again.";
  } catch (error) {
    console.error("[OpenRouter Service Exception]:", error.message);
    return "I'm having trouble connecting to Pantry AI right now. Please try again.";
  }
};

/**
 * Helper to call OpenRouter REST endpoint
 */
const callOpenRouterEndpoint = async (model, apiKey, pantryContext, userMessage) => {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: `${pantryContext}\n\nUSER QUESTION: ${userMessage}` },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "PantryPulse AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[OpenRouter API (${model}) Error ${response.status}]: ${errText.slice(0, 200)}`);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error(`[OpenRouter Fetch Error for ${model}]:`, err.message);
    return null;
  }
};

module.exports = {
  generateOpenRouterResponse,
};
