const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema(
  {
    source: String,
    session: {
      id: String,
      label: String
    },
    trace: Array,
    explanation: String,
    suggestedFix: String,
    voice: String,
    pattern: {
      type: {
        type: String,
        enum: [
          "KNOWN_PATH_FAILURE",
          "KNOWN_FUNCTION_FAILURE",
          "NEW_ANOMALY"
        ]
      },
      errorFn: String,
      failurePath: String
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Trace", TraceSchema);
