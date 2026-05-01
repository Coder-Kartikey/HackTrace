const VALID_TYPES = new Set(["function", "span", "manual"]);
const VALID_STATUS = new Set(["success", "error"]);
const VALID_SEVERITIES = new Set(["info", "warning", "critical"]);
const VALID_RUNTIMES = new Set(["browser", "node"]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateTraceEvent(event, index) {
  const errors = [];

  if (!isObject(event)) {
    return [`events[${index}] must be an object`];
  }

  if (!isNonEmptyString(event.traceId)) {
    errors.push(`events[${index}].traceId is required`);
  }

  if (!isNonEmptyString(event.sessionId)) {
    errors.push(`events[${index}].sessionId is required`);
  }

  if (!isNonEmptyString(event.name)) {
    errors.push(`events[${index}].name is required`);
  }

  if (!VALID_TYPES.has(event.type)) {
    errors.push(`events[${index}].type must be one of: function, span, manual`);
  }

  if (!VALID_STATUS.has(event.status)) {
    errors.push(`events[${index}].status must be one of: success, error`);
  }

  if (!VALID_SEVERITIES.has(event.severity)) {
    errors.push(`events[${index}].severity must be one of: info, warning, critical`);
  }

  if (!Number.isFinite(event.timestamp)) {
    errors.push(`events[${index}].timestamp must be a valid unix timestamp`);
  }

  if (!Number.isFinite(event.duration) || event.duration < 0) {
    errors.push(`events[${index}].duration must be a non-negative number`);
  }

  if (!isObject(event.environment)) {
    errors.push(`events[${index}].environment is required`);
  } else {
    if (!VALID_RUNTIMES.has(event.environment.runtime)) {
      errors.push(`events[${index}].environment.runtime must be browser or node`);
    }

    if (!isNonEmptyString(event.environment.sdkVersion)) {
      errors.push(`events[${index}].environment.sdkVersion is required`);
    }

    if (!isNonEmptyString(event.environment.appEnvironment)) {
      errors.push(`events[${index}].environment.appEnvironment is required`);
    }
  }

  if (event.metadata !== undefined && !isObject(event.metadata)) {
    errors.push(`events[${index}].metadata must be an object when provided`);
  }

  if (event.tags !== undefined && (!Array.isArray(event.tags) || event.tags.some((tag) => !isNonEmptyString(tag)))) {
    errors.push(`events[${index}].tags must be an array of strings`);
  }

  if (event.status === "error") {
    if (!isObject(event.error)) {
      errors.push(`events[${index}].error is required when status is error`);
    } else {
      if (!isNonEmptyString(event.error.fingerprint)) {
        errors.push(`events[${index}].error.fingerprint is required`);
      }

      if (!isNonEmptyString(event.error.name)) {
        errors.push(`events[${index}].error.name is required`);
      }

      if (!isNonEmptyString(event.error.message)) {
        errors.push(`events[${index}].error.message is required`);
      }
    }
  }

  return errors;
}

function validateEventsPayload(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return {
      valid: false,
      errors: ["events must be a non-empty array"],
    };
  }

  const errors = events.flatMap((event, index) => validateTraceEvent(event, index));

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateEventsPayload,
};
