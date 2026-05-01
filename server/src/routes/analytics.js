const express = require("express");
const router = express.Router();
const ErrorGroup = require("../models/ErrorGroup");
const TraceEvent = require("../models/TraceEvent");

router.get("/top-errors", async (req, res) => {
  const apiKey = req.apiKey;

  try {
    const topErrors = await ErrorGroup.find({ apiKey })
      .sort({ occurrences: -1 })
      .limit(5);

    res.json(topErrors);
  } catch (error) {
    console.error("Top errors fetch failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/error-trend", async (req, res) => {
  const apiKey = req.apiKey;

  try {
    const trend = await TraceEvent.aggregate([
      {
        $match: {
          apiKey,
          status: "error"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trend);
  } catch (error) {
    console.error("Trend fetch failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
