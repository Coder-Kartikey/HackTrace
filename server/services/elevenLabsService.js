const axios = require("axios");

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // default ElevenLabs voice

async function generateVoice(text) {
  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      text,
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
}

module.exports = { generateVoice };
