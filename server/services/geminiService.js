const axios = require("axios");

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

async function generateExplanation(trace) {
  try {
    const prompt = `
You are a senior software engineer debugging an application.

Analyze the execution trace below and respond in a clear, technical manner.

Execution Trace:
${JSON.stringify(trace, null, 2)}

Respond in the following format:

EXPLANATION:
<why the failure happened>

SUGGESTED FIX:
<what the developer should change>
`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const rawText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔒 HARD FALLBACKS (IMPORTANT)
    if (!rawText || typeof rawText !== "string") {
      return {
        explanation: "Unable to generate explanation.",
        suggestedFix: "Please inspect the failing function and add validation."
      };
    }

    // ✅ SAFE PARSING
    const explanationMatch = rawText.match(
      /EXPLANATION:\s*([\s\S]*?)SUGGESTED FIX:/i
    );
    const fixMatch = rawText.match(/SUGGESTED FIX:\s*([\s\S]*)/i);

    const explanation =
      explanationMatch?.[1]?.trim() ||
      rawText.trim();

    const suggestedFix =
      fixMatch?.[1]?.trim() ||
      "Add defensive checks around the failing function.";

    return { explanation, suggestedFix };
  } catch (err) {
    console.error("🔥 GEMINI ERROR:", err.message);

    // ✅ NEVER CRASH PIPELINE
    return {
      explanation:
        "AI explanation could not be generated due to an internal error.",
      suggestedFix:
        "Inspect the error stack trace and add appropriate error handling."
    };
  }
}

module.exports = { generateExplanation };
