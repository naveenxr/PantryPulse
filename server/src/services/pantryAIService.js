/**
 * Pantry AI Service (Pure Groq Llama 3.1 8b Instant)
 * Converts real MongoDB database FoodItem records into readable AI context
 * and queries Groq LPU API exclusively for instant zero-waste cooking suggestions.
 */

let Groq;
try {
  Groq = require("groq-sdk");
} catch (e) {
  Groq = null;
}

const SYSTEM_PROMPT_TEMPLATE = (pantryContext) => `You are PantryPulse AI, an intelligent pantry and cooking assistant.

Your job is to help the user decide what to cook based on their REAL pantry items.

CURRENT PANTRY:
${pantryContext}

RULES:

1. Only assume ingredients exist if they are listed in the pantry.
2. Prioritize ingredients that may expire soon.
3. Suggest recipes that use the available ingredients.
4. Clearly mention missing ingredients if needed.
5. Help reduce food waste.
6. Keep answers practical and easy to understand.
7. When suggesting a recipe, include:
   - Recipe name
   - Ingredients available
   - Missing ingredients
   - Simple cooking steps
8. Never invent pantry items.
9. Be friendly and concise.`;

/**
 * Generates AI response using Groq API exclusively
 * @param {string} message - User query text
 * @param {Array} pantryItems - Active FoodItem records from MongoDB
 * @param {Array} conversationHistory - Past chat messages
 * @returns {Promise<string>} AI reply text
 */
const generatePantryResponse = async (
  message,
  pantryItems = [],
  conversationHistory = []
) => {
  try {
    // Reload environment variables dynamically
    try {
      require("dotenv").config({ override: true });
    } catch (e) {}

    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    if (!apiKey) {
      console.log("[Pantry AI] GROQ_API_KEY environment variable is empty or missing.");
      return "Pantry AI is not configured yet. Please add GROQ_API_KEY to your server/.env file.";
    }

    // Convert pantry items into readable AI context
    const pantryContext =
      Array.isArray(pantryItems) && pantryItems.length > 0
        ? pantryItems
            .map((item) => {
              const qty = item.quantity || 1;
              const unit = item.unit || "pcs";
              const cat = item.category || "Other";
              const pDate = item.purchaseDate ? new Date(item.purchaseDate).getTime() : Date.now();
              const expiryDate = item.shelfLifeDays
                ? new Date(pDate + item.shelfLifeDays * 86400000).toISOString().split("T")[0]
                : "Not specified";
              return `- ${item.name}: ${qty} ${unit}, Category: ${cat}, Expiry: ${expiryDate}`;
            })
            .join("\n")
        : "No pantry items available.";

    const systemPrompt = SYSTEM_PROMPT_TEMPLATE(pantryContext);

    // Format conversation history for Groq API
    const formattedHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((msg) => msg && (msg.role || msg.sender) && (msg.content || msg.text))
          .map((msg) => ({
            role: msg.role || (msg.sender === "user" ? "user" : "assistant"),
            content: String(msg.content || msg.text),
          }))
      : [];

    const model = (process.env.GROQ_MODEL || "llama-3.1-8b-instant").trim();
    console.log(`[Pantry AI] Requesting Groq API (${model})`);

    // 1. Try official groq-sdk if available
    if (Groq) {
      try {
        const groqClient = new Groq({ apiKey });
        const completion = await groqClient.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            { role: "user", content: message },
          ],
          model,
          temperature: 0.7,
          max_tokens: 1000,
        });

        const text = completion.choices[0]?.message?.content;
        if (text) {
          console.log("[Pantry AI] Groq response generated via groq-sdk");
          return text.trim();
        }
      } catch (sdkErr) {
        console.error("[Pantry AI SDK Error]:", sdkErr.message);
      }
    }

    // 2. Direct HTTP REST API call for Groq API
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message },
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
      const errorText = await response.text();
      console.error(`[Groq API Status ${response.status}]: ${errorText.slice(0, 200)}`);
      return "I'm having trouble connecting to Groq Pantry AI. Please try again in a moment.";
    }

    const data = await response.json();
    const replyText = data?.choices?.[0]?.message?.content;

    if (replyText) {
      console.log("[Pantry AI] Groq response generated via REST API");
      return replyText.trim();
    }

    return "Sorry, I couldn't generate a response from Groq right now.";
  } catch (error) {
    console.error("[Pantry AI Exception]:", error.message);
    return "I'm having trouble connecting to Groq Pantry AI right now. Please try again.";
  }
};

module.exports = {
  generatePantryResponse,
};
