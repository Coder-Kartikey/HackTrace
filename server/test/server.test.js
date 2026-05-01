const test = require("node:test");
const assert = require("node:assert/strict");

const { parseApiKeys } = require("../src/config/auth");
const { requireApiKey, getApiKeyFromRequest } = require("../src/middleware/requireApiKey");
const { validateEventsPayload } = require("../src/validation/events");
const { buildErrorGroupUpdates, chooseHigherSeverity } = require("../src/services/ingestionService");

test("parseApiKeys splits and trims configured keys", () => {
  assert.deepEqual(parseApiKeys("test, demo , prod"), ["test", "demo", "prod"]);
});

test("requireApiKey accepts configured keys and rejects invalid ones", () => {
  process.env.API_KEYS = "test,demo";

  const acceptedReq = { headers: { "x-api-key": "demo" } };
  const rejectedReq = { headers: { "x-api-key": "bad" } };

  let nextCalled = false;
  requireApiKey(acceptedReq, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(acceptedReq.apiKey, "demo");
  assert.equal(getApiKeyFromRequest(rejectedReq), "bad");

  let statusCode;
  let payload;
  requireApiKey(
    rejectedReq,
    {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        payload = body;
      },
    },
    () => {
      throw new Error("next should not be called for invalid API keys");
    }
  );

  assert.equal(statusCode, 403);
  assert.deepEqual(payload, { error: "Invalid API key" });
});

test("validateEventsPayload accepts well-formed events and rejects malformed ones", () => {
  const validEvent = {
    traceId: "trace-1",
    rootTraceId: "trace-1",
    sessionId: "session-1",
    name: "loadUsers",
    type: "function",
    status: "error",
    severity: "warning",
    timestamp: Date.now(),
    duration: 42,
    error: {
      fingerprint: "fp-1",
      name: "TypeError",
      message: "boom",
    },
    environment: {
      runtime: "node",
      sdkVersion: "2.0.0",
      appEnvironment: "development",
    },
    metadata: {},
    tags: ["demo"],
  };

  assert.equal(validateEventsPayload([validEvent]).valid, true);

  const invalidResult = validateEventsPayload([{ ...validEvent, traceId: "", tags: [1] }]);
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.some((error) => error.includes("traceId")));
  assert.ok(invalidResult.errors.some((error) => error.includes("tags")));
});

test("buildErrorGroupUpdates keeps first/last seen timestamps and highest severity", () => {
  const events = [
    {
      name: "loadUsers",
      status: "error",
      severity: "warning",
      timestamp: new Date("2026-01-01T10:00:00Z").getTime(),
      error: {
        fingerprint: "fp-1",
        name: "TypeError",
        message: "first",
      },
      environment: {
        appEnvironment: "development",
      },
    },
    {
      name: "loadUsers",
      status: "error",
      severity: "critical",
      timestamp: new Date("2026-01-01T12:00:00Z").getTime(),
      error: {
        fingerprint: "fp-1",
        name: "TypeError",
        message: "second",
      },
      environment: {
        appEnvironment: "production",
      },
    },
  ];

  const [group] = buildErrorGroupUpdates(events);

  assert.equal(group.occurrences, 2);
  assert.equal(group.firstSeen.toISOString(), "2026-01-01T10:00:00.000Z");
  assert.equal(group.lastSeen.toISOString(), "2026-01-01T12:00:00.000Z");
  assert.equal(group.severity, "critical");
  assert.equal(chooseHigherSeverity("warning", "critical"), "critical");
});
