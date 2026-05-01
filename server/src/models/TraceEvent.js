const mongoose = require("mongoose");

const TraceEventSchema = new mongoose.Schema({
  apiKey: { type: String, required: true, index: true },

  traceId: { type: String, required: true },
  parentId: { type: String },
  rootTraceId: { type: String, index: true },

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

  
  error: {
    fingerprint: { type: String, index: true },
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

TraceEventSchema.index({ apiKey: 1, traceId: 1 });
TraceEventSchema.index({ apiKey: 1, rootTraceId: 1, timestamp: 1 });
TraceEventSchema.index({ apiKey: 1, "error.fingerprint": 1, timestamp: -1 });

module.exports = mongoose.model("TraceEvent", TraceEventSchema);
