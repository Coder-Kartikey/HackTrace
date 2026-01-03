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
    voice: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trace", TraceSchema);
