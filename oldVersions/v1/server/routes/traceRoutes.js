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

    // Handle both old array format and new stack format
    let traceStack = Array.isArray(trace) ? trace : trace?.stack || [];
    if (!traceStack || !Array.isArray(traceStack)) {
      return res.status(400).json({ error: "Invalid trace data" });
    }

    // ✅ 1. Extract pattern signatures FIRST
    const errorFn = extractErrorFunction(traceStack);
    const failurePath = extractFailurePath(traceStack);

    // ✅ 2. Classify pattern
    const patternResult = await classifyPattern(errorFn, failurePath);

    // ✅ 3. AI explanation
    const { explanation, suggestedFix } = await generateExplanation(traceStack);

    // ✅ 4. Voice generation
    const voiceBase64 = await generateVoice(explanation);

    // ✅ 5. Calculate total duration
    const totalDuration = traceStack.reduce((sum, item) => sum + (item.duration || 0), 0);

    // ✅ 6. Extract error message from last error event
    const errorEvent = traceStack.find(e => e.type === 'error');
    const errorMessage = errorEvent?.errorMessage || 'Unknown error';

    // ✅ 7. Save everything in new schema format
    const savedTrace = await Trace.create({
      trace: {
        stack: traceStack,
        totalDuration,
        errorMessage
      },
      source,
      session,
      explanation,
      suggestedFix,
      voice: {
        confidence: 0.75,
        severity: 'medium'
      },
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
    const traces = await Trace.find({})
      .sort({ createdAt: -1 })
      .select("_id session source pattern createdAt");

    res.json(traces);
  } catch (err) {
    console.error('Error fetching traces:', err);
    res.status(500).json({ error: 'Failed to fetch traces' });
  }
});

// Get trace by ID
const { normalizeTrace } = require("../utils/normalizeTrace");

router.get("/:id", async (req, res) => {
  try {
    const trace = await Trace.findById(req.params.id);
    if (!trace) {
      return res.status(404).json({ error: "Trace not found" });
    }

    res.json({
      _id: trace._id,
      session: trace.session,
      source: trace.source,
      createdAt: trace.createdAt,
      trace: trace.trace,
      pattern: trace.pattern,
      explanation: trace.explanation,
      suggestedFix: trace.suggestedFix,
      voice: trace.voice
    });
  } catch (err) {
    console.error('Error fetching trace:', err);
    res.status(500).json({ error: 'Failed to fetch trace' });
  }
});



module.exports = router;
