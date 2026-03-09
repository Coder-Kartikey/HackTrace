const express = require("express");
const router = express.Router();
const { ingestEvents } = require("../services/ingestionService");

router.post("/", async (req, res) => {

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  const { events } = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    await ingestEvents(apiKey, events);
    res.json({ success: true });
  } catch (error) {
    console.error("Ingestion error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;