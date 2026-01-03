const mongoose = require("mongoose");

const TraceSchema = new mongoose.Schema(
  {
    source: String,
    trace: Array,
    explanation: String,
    voice: String // base64 audio
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trace", TraceSchema);
