const mongoose = require("mongoose");

const ErrorGroupSchema = new mongoose.Schema({
  apiKey: { type: String, index: true },

  fingerprint: { type: String, required: true },

  errorName: String,
  message: String,

  firstSeen: { type: Date },
  lastSeen: { type: Date },

  occurrences: { type: Number, default: 1 },

  severity: {
    type: String,
    enum: ["warning", "critical"]
  },

  affectedFunctions: [String],
  environments: [String]

}, { timestamps: true });

ErrorGroupSchema.index({ apiKey: 1, fingerprint: 1 }, { unique: true });
ErrorGroupSchema.index({ apiKey: 1, occurrences: -1 });

module.exports = mongoose.model("ErrorGroup", ErrorGroupSchema);
