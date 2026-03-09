const express = require("express");
const router = express.Router();
const ErrorGroup = require("../models/ErrorGroup");

router.get("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  try {
    const errors = await ErrorGroup.find({ apiKey })
      .sort({ occurrences: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(errors);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:fingerprint", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  const { fingerprint } = req.params;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  try {
    const errorGroup = await ErrorGroup.findOne({
      apiKey,
      fingerprint
    });

    if (!errorGroup) {
      return res.status(404).json({ error: "Not found" });
    }

    const relatedEvents = await require("../models/TraceEvent")
      .find({ apiKey, fingerprint })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      group: errorGroup,
      recentEvents: relatedEvents
    });

  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;