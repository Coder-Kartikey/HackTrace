const express = require("express");
const Trace = require("../models/Trace");
const { generateExplanation } = require("../services/geminiService");
const { generateVoice } = require("../services/elevenLabsService");
const {
  extractErrorFunction,
  extractFailurePath
} = require("../utils/patternUtils");

const { classifyPattern } = require("../services/patternService");


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { trace, source, session } = req.body;
    // console.log("📥 Incoming trace payload:", req.body);

    if (!trace || !Array.isArray(trace)) {
      return res.status(400).json({ error: "Invalid trace data" });
    }

    // ✅ 1. Extract pattern signatures FIRST
    const errorFn = extractErrorFunction(trace);
    const failurePath = extractFailurePath(trace);

    // ✅ 2. Classify pattern
    const patternResult = await classifyPattern(errorFn, failurePath);

    // ✅ 3. AI explanation
    const { explanation, suggestedFix } = await generateExplanation(trace);

    // ✅ 4. Voice generation
    const voiceBase64 = await generateVoice(explanation);

    // ✅ 5. Save everything (NOW variables exist)
    const savedTrace = await Trace.create({
      trace,
      source,
      session,
      explanation,
      suggestedFix,
      voice: voiceBase64 || null,
      pattern: {
        type: patternResult.type,
        errorFn,
        failurePath
      }
    });

    res.json({
      success: true,
      traceId: savedTrace._id,
      explanation,
      suggestedFix,
      voice: voiceBase64,
      pattern: savedTrace.pattern
    });
  } catch (err) {
    console.error("🔥 TRACE PROCESSING ERROR:", err);
    res.status(500).json({ error: "Failed to process trace" });
  }
});


router.get("/latest", async (req, res) => {
  try {
    const trace = await Trace.findOne().sort({ createdAt: -1 });
    res.json(trace);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trace" });
  }
});

// Get all traces (latest first)
router.get("/", async (req, res) => {
  try {
    const traces = await Trace.find()
      .sort({ createdAt: -1 })
      .select("session createdAt");
    res.json(traces);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch traces" });
  }
});

// Get trace by ID
router.get("/:id", async (req, res) => {
  try {
    const trace = await Trace.findById(req.params.id);
    res.json(trace);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trace" });
  }
});


module.exports = router;
