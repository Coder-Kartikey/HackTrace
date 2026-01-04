function normalizeTrace(traceArray) {
  const stack = traceArray.map((event, index) => ({
    function: event.fn ?? `step_${index + 1}`,
    file: event.file ?? "unknown",
    line: event.line ?? 0,
    column: event.column ?? 0,
    duration: event.duration ?? event.time ?? 0
  }));

  const totalDuration = stack.reduce(
    (sum, cur) => sum + (Number(cur.duration) || 0),
    0
  );

  const errorEvent = traceArray.find(e => e.type === "error");

  return {
    stack,
    totalDuration,
    errorMessage: errorEvent?.error ?? "Unknown error"
  };
}

module.exports = { normalizeTrace };
