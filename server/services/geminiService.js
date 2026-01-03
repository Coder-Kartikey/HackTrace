// import { GoogleGenAI } from "@google/genai";
// // const axios = require("axios");
// import axios from "axios";

// const ai = new GoogleGenAI({});

// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-tts:generateContent";

// async function generateExplanation(trace) {
//   const prompt = `
// You are a debugging assistant.

// Analyze the execution trace below and explain:
// 1. Why the program failed
// 2. The root cause of the error
// 3. What the developer should fix

// Execution Trace:
// ${JSON.stringify(trace, null, 2)}

// Keep the explanation concise, clear, and developer-friendly.
// `;

//   const response = await
//     ai.models.generateContent(
//     {
//       model: "gemini-2.5-flash-lite",
//       contents: [
//         {
//           parts: [{ text: prompt }]
//         }
//       ]
//     });

//   return response.data.candidates[0].content.parts[0].text;
// }

// // module.exports = { generateExplanation };
// export { generateExplanation };
const axios = require("axios");

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

async function generateExplanation(trace) {
  const prompt = `
You are a senior software engineer debugging an application.

Given the execution trace below:
1. Explain why the program failed
2. Identify the root cause
3. Suggest a concrete fix the developer should apply

Execution Trace:
${JSON.stringify(trace, null, 2)}

Keep it concise and developer-friendly.
`;

  try {
    const response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("🔥 GEMINI ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { generateExplanation };
