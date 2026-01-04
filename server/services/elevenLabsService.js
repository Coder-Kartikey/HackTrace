const axios = require("axios");

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

async function generateVoice(text) {
  // ✅ Hard guard (MOST IMPORTANT)
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    console.warn("⚠️ Skipping voice generation: empty text");
    return null;
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text, // ✅ REQUIRED
        model_id: "eleven_monolingual_v1"
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    return Buffer.from(response.data).toString("base64");
  } catch (err) {
    console.error("🎧 ElevenLabs error:", err.response?.status);
    return null; // ✅ Never crash pipeline
  }
}

module.exports = { generateVoice };
