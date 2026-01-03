// sdk/hacktrace.js

let trace = [];
let startTime = null;

/**
 * Start a new trace session
 */
function startTrace() {
  trace = [];
  startTime = Date.now();
}

/**
 * Wrap a function to trace its execution
 * @param {string} name - Function name
 * @param {Function} fn - Original function
 */
function traceFn(name, fn) {
  return function (...args) {
    const time = Date.now() - startTime;

    trace.push({
      fn: name,
      time
    });

    try {
      return fn(...args);
    } catch (error) {
      trace.push({
        fn: name,
        time: Date.now() - startTime,
        error: error.message
      });

      throw error; // rethrow so app still crashes
    }
  };
}

/**
 * Get the collected trace
 */
function getTrace() {
  return trace;
}

module.exports = {
  startTrace,
  traceFn,
  getTrace
};
