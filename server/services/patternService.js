const Trace = require("../models/Trace");

async function classifyPattern(errorFn, failurePath) {
  // 1️⃣ Check for same failure path
  const samePath = await Trace.findOne({
    "pattern.failurePath": failurePath
  });

  if (samePath) {
    return {
      type: "KNOWN_PATH_FAILURE",
      matchedWith: samePath._id
    };
  }

  // 2️⃣ Check for same error function
  const sameFunction = await Trace.findOne({
    "pattern.errorFn": errorFn
  });

  if (sameFunction) {
    return {
      type: "KNOWN_FUNCTION_FAILURE",
      matchedWith: sameFunction._id
    };
  }

  // 3️⃣ New anomaly
  return {
    type: "NEW_ANOMALY",
    matchedWith: null
  };
}

module.exports = { classifyPattern };
