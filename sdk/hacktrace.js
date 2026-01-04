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
 * Stop trace and return session payload in new schema format
 */
function stopTrace() {
  const errorEvent = trace.find(e => e.type === 'error');
  const totalDuration = trace.reduce((sum, event) => sum + (event.duration || 0), 0);
  
  return {
    session,
    trace: {
      stack: trace,
      totalDuration,
      errorMessage: errorEvent?.errorMessage || 'No error'
    }
  };
}

/**
 * Extract file and line info from stack
 */
function getCallerInfo() {
  const stack = new Error().stack.split('\n');
  const callerLine = stack[3] || '';
  const match = callerLine.match(/\((.+):(\d+):(\d+)\)/);
  
  if (match) {
    return {
      file: match[1],
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10)
    };
  }
  return { file: 'unknown', line: 0, column: 0 };
}

/**
 * Wrap sync/async functions
 */
function traceFn(name, fn) {
  return function (...args) {
    const fnStartTime = Date.now();
    const callerInfo = getCallerInfo();

    trace.push({
      fn: name,
      file: callerInfo.file,
      line: callerInfo.line,
      column: callerInfo.column,
      type: "start",
      timestamp: new Date().toISOString()
    });

    try {
      const result = fn(...args);

      if (result && typeof result.then === "function") {
        return result
          .then((res) => {
            const duration = Date.now() - fnStartTime;
            trace.push({
              fn: name,
              file: callerInfo.file,
              line: callerInfo.line,
              column: callerInfo.column,
              type: "end",
              duration,
              timestamp: new Date().toISOString()
            });
            return res;
          })
          .catch((error) => {
            const duration = Date.now() - fnStartTime;
            trace.push({
              fn: name,
              file: callerInfo.file,
              line: callerInfo.line,
              column: callerInfo.column,
              type: "error",
              duration,
              errorMessage: error.message,
              timestamp: new Date().toISOString()
            });
            throw error;
          });
      }

      const duration = Date.now() - fnStartTime;
      trace.push({
        fn: name,
        file: callerInfo.file,
        line: callerInfo.line,
        column: callerInfo.column,
        type: "end",
        duration,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const duration = Date.now() - fnStartTime;
      trace.push({
        fn: name,
        file: callerInfo.file,
        line: callerInfo.line,
        column: callerInfo.column,
        type: "error",
        duration,
        errorMessage: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };
}

/**
 * Send trace to backend API
 */
async function sendTrace(source, apiUrl = 'http://localhost:5000/api/traces') {
  const { session, trace: traceData } = stopTrace();
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session,
        trace: traceData.stack,
        source
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Trace sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send trace:', error);
    throw error;
  }
}

module.exports = {
  startTrace,
  stopTrace,
  sendTrace,
  traceFn
};
