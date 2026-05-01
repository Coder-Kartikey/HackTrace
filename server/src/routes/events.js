const express = require("express");
const router = express.Router();
const { ingestEvents } = require("../services/ingestionService");
const { validateEventsPayload } = require("../validation/events");

router.post("/", async (req, res) => {
  const apiKey = req.apiKey;
  const { events } = req.body;

  const validation = validateEventsPayload(events);
  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid payload",
      details: validation.errors,
    });
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
