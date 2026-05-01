const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;
let server;
let baseUrl;

function makeEvent({
  traceId,
  parentId,
  rootTraceId,
  name,
  status,
  severity,
  timestamp,
  duration,
  fingerprint,
}) {
  return {
    traceId,
    parentId,
    rootTraceId,
    sessionId: "session-1",
    name,
    type: "function",
    status,
    severity,
    timestamp,
    duration,
    error: status === "error"
      ? {
          fingerprint,
          name: "ReferenceError",
          message: `${name} failed`,
          stack: `ReferenceError: ${name} failed`,
        }
      : undefined,
    metadata: { feature: "integration" },
    tags: ["integration"],
    environment: {
      runtime: "node",
      sdkVersion: "2.0.0",
      appEnvironment: "test",
    },
  };
}

test.before(async () => {
  process.env.API_KEYS = "test";
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri("hacktrace-test");

  const app = require("../src/app");
  const connectDB = require("../src/config/db");

  await connectDB();

  server = await new Promise((resolve) => {
    const listener = app.listen(0, () => resolve(listener));
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test("events ingestion flows through analytics, errors, and traces routes", async () => {
  const timestampA = new Date("2026-02-01T10:00:00.000Z").getTime();
  const timestampB = new Date("2026-02-01T10:00:01.000Z").getTime();
  const timestampC = new Date("2026-02-01T10:00:02.000Z").getTime();

  const events = [
    makeEvent({
      traceId: "root-1",
      rootTraceId: "root-1",
      name: "root",
      status: "success",
      severity: "info",
      timestamp: timestampA,
      duration: 30,
    }),
    makeEvent({
      traceId: "child-1",
      parentId: "root-1",
      rootTraceId: "root-1",
      name: "child-warning",
      status: "error",
      severity: "warning",
      timestamp: timestampB,
      duration: 10,
      fingerprint: "fp-1",
    }),
    makeEvent({
      traceId: "child-2",
      parentId: "root-1",
      rootTraceId: "root-1",
      name: "child-critical",
      status: "error",
      severity: "critical",
      timestamp: timestampC,
      duration: 20,
      fingerprint: "fp-1",
    }),
  ];

  const ingestResponse = await fetch(`${baseUrl}/events`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": "test",
    },
    body: JSON.stringify({ events }),
  });

  assert.equal(ingestResponse.status, 200);
  assert.deepEqual(await ingestResponse.json(), { success: true });

  const errorsResponse = await fetch(`${baseUrl}/errors`, {
    headers: { "x-api-key": "test" },
  });
  const errors = await errorsResponse.json();

  assert.equal(errorsResponse.status, 200);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].occurrences, 2);
  assert.equal(errors[0].severity, "critical");
  assert.equal(new Date(errors[0].firstSeen).toISOString(), "2026-02-01T10:00:01.000Z");
  assert.equal(new Date(errors[0].lastSeen).toISOString(), "2026-02-01T10:00:02.000Z");

  const errorDetailResponse = await fetch(`${baseUrl}/errors/fp-1`, {
    headers: { "x-api-key": "test" },
  });
  const errorDetail = await errorDetailResponse.json();

  assert.equal(errorDetailResponse.status, 200);
  assert.equal(errorDetail.group.fingerprint, "fp-1");
  assert.equal(errorDetail.recentEvents.length, 2);

  const topErrorsResponse = await fetch(`${baseUrl}/analytics/top-errors`, {
    headers: { "x-api-key": "test" },
  });
  const topErrors = await topErrorsResponse.json();

  assert.equal(topErrorsResponse.status, 200);
  assert.equal(topErrors[0].fingerprint, "fp-1");

  const trendResponse = await fetch(`${baseUrl}/analytics/error-trend`, {
    headers: { "x-api-key": "test" },
  });
  const trend = await trendResponse.json();

  assert.equal(trendResponse.status, 200);
  assert.deepEqual(trend, [{ _id: "2026-02-01", count: 2 }]);

  const tracesResponse = await fetch(`${baseUrl}/traces/child-1`, {
    headers: { "x-api-key": "test" },
  });
  const traceEvents = await tracesResponse.json();

  assert.equal(tracesResponse.status, 200);
  assert.equal(traceEvents.length, 3);
  assert.deepEqual(
    traceEvents.map((event) => event.traceId),
    ["root-1", "child-1", "child-2"]
  );
});

test.after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  if (mongod) {
    await mongod.stop();
  }
});
