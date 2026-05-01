const TraceEvent = require("../models/TraceEvent");
const ErrorGroup = require("../models/ErrorGroup");

const SEVERITY_RANK = {
  info: 0,
  warning: 1,
  critical: 2,
};

function normalizeTimestamp(timestamp) {
  return new Date(timestamp);
}

function chooseHigherSeverity(currentSeverity, nextSeverity) {
  return (SEVERITY_RANK[nextSeverity] ?? 0) > (SEVERITY_RANK[currentSeverity] ?? 0)
    ? nextSeverity
    : currentSeverity;
}

function buildErrorGroupUpdates(events) {
  const groupedErrors = new Map();

  for (const event of events) {
    if (event.status !== "error" || !event.error?.fingerprint) {
      continue;
    }

    const timestamp = normalizeTimestamp(event.timestamp);
    const existingGroup = groupedErrors.get(event.error.fingerprint);

    if (!existingGroup) {
      groupedErrors.set(event.error.fingerprint, {
        fingerprint: event.error.fingerprint,
        errorName: event.error.name,
        message: event.error.message,
        firstSeen: timestamp,
        lastSeen: timestamp,
        occurrences: 1,
        severity: event.severity,
        affectedFunctions: new Set([event.name]),
        environments: new Set(event.environment?.appEnvironment ? [event.environment.appEnvironment] : []),
      });
      continue;
    }

    existingGroup.occurrences += 1;
    existingGroup.firstSeen = existingGroup.firstSeen < timestamp ? existingGroup.firstSeen : timestamp;
    existingGroup.lastSeen = existingGroup.lastSeen > timestamp ? existingGroup.lastSeen : timestamp;
    existingGroup.severity = chooseHigherSeverity(existingGroup.severity, event.severity);
    existingGroup.affectedFunctions.add(event.name);
    if (event.environment?.appEnvironment) {
      existingGroup.environments.add(event.environment.appEnvironment);
    }
  }

  return Array.from(groupedErrors.values());
}

async function ingestEvents(apiKey, events) {
  const traceEvents = events.map((event) => ({
    apiKey,
    ...event,
    timestamp: normalizeTimestamp(event.timestamp),
  }));

  await TraceEvent.insertMany(traceEvents, { ordered: true });

  const groupedErrors = buildErrorGroupUpdates(events);
  if (!groupedErrors.length) {
    return;
  }

  await ErrorGroup.bulkWrite(
    groupedErrors.map((group) => {
      const update = {
        $inc: { occurrences: group.occurrences },
        $min: { firstSeen: group.firstSeen },
        $max: { lastSeen: group.lastSeen },
        $setOnInsert: {
          errorName: group.errorName,
          fingerprint: group.fingerprint,
          message: group.message,
        },
        $addToSet: {
          affectedFunctions: { $each: Array.from(group.affectedFunctions) },
          environments: { $each: Array.from(group.environments) },
        },
      };

      if (group.severity === "critical") {
        update.$set = { severity: "critical" };
      } else {
        update.$setOnInsert.severity = group.severity;
      }

      return {
        updateOne: {
          filter: { apiKey, fingerprint: group.fingerprint },
          update,
          upsert: true,
        },
      };
    })
  );
}

module.exports = {
  ingestEvents,
  buildErrorGroupUpdates,
  chooseHigherSeverity,
};
