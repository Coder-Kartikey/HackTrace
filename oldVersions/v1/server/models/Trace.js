const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },

    session: {
      id: { type: String, required: true },
      label: { type: String, required: true }
    },

    // raw execution trace events
    trace: {
      stack: [{
        type: {
          type: String,
          enum: ["start", "end", "error", "info", "debug"],
          default: "start"
        },
        fn: { type: String },
        file: { type: String },
        line: { type: Number },
        column: { type: Number },
        duration: { type: Number },
        timestamp: { type: Date },
        errorMessage: { type: String }
      }],
      totalDuration: { type: Number },
      errorMessage: { type: String },
    },

    // AI outputs
    explanation: { type: String, default: "" },
    suggestedFix: { type: String, default: "" },

    // pattern learning
    pattern: {
      type: {
        type: String,
        enum: [
          "KNOWN_PATH_FAILURE",
          "KNOWN_FUNCTION_FAILURE",
          "NEW_ANOMALY"
        ],
        default: "NEW_ANOMALY"
      },
      errorFn: { type: String },
      failurePath: [{ type: String }]
    },

    // voice metadata (NOT audio blob)
    voice: {
      confidence: { type: Number, default: 0.75 },
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trace", TraceSchema);
