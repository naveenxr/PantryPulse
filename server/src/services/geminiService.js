/**
 * Gemini AI Service with Groq LLM Fallback
 * Handles communication with AI providers (Google Gemini & Groq LLMs)
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
 * Generates an AI response from Gemini or Groq fallback
 * @param {string} userMessage - User input prompt
 * @param {string} pantryContext - Structured string summarizing pantry state
 * @returns {Promise<string>} Clean AI text response
 */
const generateAIResponse = async (userMessage, pantryContext) => {
  // Dynamically reload environment variables
  try {
    require("dotenv").config({ override: true });
  } catch (e) {}

  const geminiApiKey = (process.env.GEMINI_API_KEY || "").trim();
  const groqApiKey = (process.env.GROQ_API_KEY || "").trim();

  const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${pantryContext}\n\nUSER QUESTION: ${userMessage}`;

  // 1. Try Gemini API first if configured
  if (geminiApiKey) {
    const configuredModel = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
    console.log(`[Pantry AI] Attempting Gemini request (${configuredModel})`);

    const modelsToTry = Array.from(new Set([configuredModel, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]));
    for (const m of modelsToTry) {
      const responseText = await callGeminiEndpoint(m, geminiApiKey, fullPrompt);
      if (responseText) {
        console.log(`[Pantry AI] Gemini response received using model: ${m}`);
        return responseText.trim();
      }
    }
  }

  // 2. Fallback to Groq API (llama-3.1-8b-instant) if Gemini key fails or is invalid
  if (groqApiKey) {
    const groqModel = (process.env.GROQ_MODEL || "llama-3.1-8b-instant").trim();
    console.log(`[Pantry AI] Fallback to Groq API (${groqModel})`);
    
    const groqResponse = await callGroqEndpoint(groqApiKey, groqModel, SYSTEM_INSTRUCTION, `${pantryContext}\n\nUSER QUESTION: ${userMessage}`);
    if (groqResponse) {
      console.log(`[Pantry AI] Response generated successfully via Groq (${groqModel})`);
      return groqResponse.trim();
    }
  }

  // CASE 1: Missing API Keys
  if (!geminiApiKey && !groqApiKey) {
    return "Pantry AI is not configured yet. Please add GEMINI_API_KEY or GROQ_API_KEY to the backend environment.";
  }

  return "I couldn't generate a response right now. Please check your API key permissions or try again.";
};

/**
 * Helper function to send REST API request to Google Gemini API
 */
const callGeminiEndpoint = async (model, apiKey, prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Gemini API (${model}) Error ${response.status}]: ${errorBody.slice(0, 180)}`);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (fetchErr) {
    console.error(`[Gemini API Fetch Error]:`, fetchErr.message);
    return null;
  }
};

/**
 * Helper function to send REST API request to Groq API
 */
const callGroqEndpoint = async (apiKey, model, systemPrompt, userMessage) => {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  };

  try {
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
      console.error(`[Groq API Error ${response.status}]: ${errText.slice(0, 180)}`);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("[Groq API Fetch Error]:", err.message);
    return null;
  }
};

module.exports = {
  generateAIResponse,
};
