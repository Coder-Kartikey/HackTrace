function extractErrorFunction(trace) {
  const errorEvent = trace.find(e => e.type === "error");
  return errorEvent ? errorEvent.fn : null;
}

function extractFailurePath(trace) {
  const path = [];
  for (const event of trace) {
    if (event.type === "start") {
      path.push(event.fn);
    }
    if (event.type === "error") {
      break;
    }
  }
  return path.join(">");
}

module.exports = {
  extractErrorFunction,
  extractFailurePath
};
