const mongoose = require("mongoose");

const TraceEventSchema = new mongoose.Schema({
  apiKey: { type: String, required: true, index: true },

  traceId: { type: String, required: true },
  parentId: { type: String },

  sessionId: { type: String, required: true, index: true },

  name: { type: String, required: true },

  type: {
    type: String,
    enum: ["function", "span", "manual"],
    required: true
  },

  status: {
    type: String,
    enum: ["success", "error"],
    required: true
  },

  severity: {
    type: String,
    enum: ["info", "warning", "critical"],
    required: true,
    index: true
  },

  duration: Number,
  timestamp: { type: Date, default: Date.now, index: true },

  fingerprint: { type: String, index: true },

  error: {
    name: String,
    message: String,
    stack: String
  },

  metadata: mongoose.Schema.Types.Mixed,
  tags: [{ type: String, index: true }],

  environment: {
    runtime: String,
    sdkVersion: String,
    appEnvironment: String
  }

}, { timestamps: true });

module.exports = mongoose.model("TraceEvent", TraceEventSchema);