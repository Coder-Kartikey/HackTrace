// sdk/hacktrace.js

let trace = [];
let startTime = null;
let session = {
  id: null,
  label: null
};

/**
 * Start a new trace session
 */
function startTrace(options = {}) {
  trace = [];
  startTime = Date.now();

  session.id = options.sessionId || `session-${Date.now()}`;
  session.label = options.label || "Unnamed Session";
}

/**
 * Stop trace and return session payload
 */
function stopTrace() {
  return {
    session,
    trace
  };
}

/**
 * Wrap sync/async functions
 */
function traceFn(name, fn) {
  return function (...args) {
    const start = Date.now() - startTime;

    trace.push({
      fn: name,
      time: start,
      type: "start"
    });

    try {
      const result = fn(...args);

      if (result && typeof result.then === "function") {
        return result
          .then((res) => {
            trace.push({
              fn: name,
              time: Date.now() - startTime,
              type: "end"
            });
            return res;
          })
          .catch((error) => {
            trace.push({
              fn: name,
              time: Date.now() - startTime,
              type: "error",
              error: error.message
            });
            throw error;
          });
      }

      trace.push({
        fn: name,
        time: Date.now() - startTime,
        type: "end"
      });

      return result;
    } catch (error) {
      trace.push({
        fn: name,
        time: Date.now() - startTime,
        type: "error",
        error: error.message
      });
      throw error;
    }
  };
}

module.exports = {
  startTrace,
  stopTrace,
  traceFn
};
