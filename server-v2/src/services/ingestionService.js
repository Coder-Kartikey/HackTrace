const TraceEvent = require("../models/TraceEvent");
const ErrorGroup = require("../models/ErrorGroup");

async function ingestEvents(apiKey, events) {

  for (const event of events) {

    await TraceEvent.create({
      apiKey,
      ...event,
      timestamp: new Date(event.timestamp)
    });

    if (event.status === "error" && event.error?.fingerprint) {

      await ErrorGroup.updateOne(
        { apiKey, fingerprint: event.error.fingerprint },
        {
          $inc: { occurrences: 1 },
          $set: {
            lastSeen: new Date(),
            severity: event.severity
          },
          $setOnInsert: {
            firstSeen: new Date(),
            errorName: event.error?.name,
            fingerprint: event.error.fingerprint,
            message: event.error?.message
          },
          $addToSet: {
            affectedFunctions: event.name,
            environments: event.environment?.appEnvironment
          }
        },
        { upsert: true }
      );
    }
  }
}

module.exports = { ingestEvents };