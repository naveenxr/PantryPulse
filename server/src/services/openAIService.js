/**
 * OpenAI Chat AI Service
 * Handles communication with OpenAI GPT models using system instructions and pantry context.
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
 * Generates an AI response from OpenAI GPT model
 * @param {string} userMessage - User query text
 * @param {string} pantryContext - Structured pantry context string
 * @returns {Promise<string>} Clean AI reply
 */
const generateOpenAIResponse = async (userMessage, pantryContext) => {
  try {
    // Reload environment variables dynamically
    try {
      require("dotenv").config({ override: true });
    } catch (e) {}

    const apiKey = (process.env.OPENAI_API_KEY || "").trim();

    if (!apiKey) {
      console.log("[OpenAI Service] OPENAI_API_KEY environment variable is empty or missing.");
      return "Pantry AI is not configured yet. Please add OPENAI_API_KEY to your server/.env file.";
    }

    const model = (process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
    console.log(`[OpenAI Service] Requesting OpenAI API (${model})`);

    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${pantryContext}\n\nUSER QUESTION: ${userMessage}`;

    const url = "https://api.openai.com/v1/chat/completions";
    const payload = {
      model,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: `${pantryContext}\n\nUSER QUESTION: ${userMessage}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[OpenAI API Error ${response.status}]: ${errText.slice(0, 200)}`);
      
      // Retry with fallback gpt-3.5-turbo if primary model fails
      if (model !== "gpt-3.5-turbo") {
        console.log("[OpenAI Service] Retrying with fallback model gpt-3.5-turbo");
        return await retryWithModel("gpt-3.5-turbo", apiKey, payload.messages);
      }
      return "I'm having trouble connecting to OpenAI. Please check your API key or try again.";
    }

    const data = await response.json();
    const replyText = data?.choices?.[0]?.message?.content;

    if (replyText) {
      console.log("[OpenAI Service] OpenAI response generated successfully");
      return replyText.trim();
    }

    return "Sorry, I couldn't generate a response right now.";
  } catch (error) {
    console.error("[OpenAI Service Exception]:", error.message);
    return "I'm having trouble connecting to Pantry AI right now. Please try again.";
  }
};

const retryWithModel = async (model, apiKey, messages) => {
  try {
    const url = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1000 }),
    });

    if (response.ok) {
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    }
  } catch (e) {}
  return null;
};

module.exports = {
  generateOpenAIResponse,
};
