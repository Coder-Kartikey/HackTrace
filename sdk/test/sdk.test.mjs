import test, { after } from "node:test";
import assert from "node:assert/strict";

import * as HackTrace from "../dist/index.mjs";

const originalFetch = globalThis.fetch;
const originalSetInterval = globalThis.setInterval;

function createFetchStub() {
  const payloads = [];

  globalThis.fetch = async (_url, options = {}) => {
    payloads.push(JSON.parse(options.body));
    return {
      ok: true,
      status: 200,
    };
  };

  return payloads;
}

test("init is idempotent and only starts one batch timer", async () => {
  let intervalCount = 0;

  globalThis.setInterval = ((handler, timeout, ...args) => {
    intervalCount += 1;
    return originalSetInterval(handler, timeout, ...args);
  });

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    autoCapture: false,
  });

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    autoCapture: false,
  });

  assert.equal(intervalCount, 1);

  await HackTrace.shutdown();
  globalThis.setInterval = originalSetInterval;
});

test("trace captures hierarchy, manual spans, and classified errors", async () => {
  const payloads = createFetchStub();

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    autoCapture: false,
  });

  await HackTrace.trace("outer", async () => {
    const spanId = HackTrace.startSpan("manual");
    HackTrace.endSpan(spanId);

    await HackTrace.trace("inner", async () => {});

    await assert.rejects(
      HackTrace.trace("bad", async () => {
        throw new ReferenceError("boom");
      }),
      ReferenceError
    );
  });

  await HackTrace.shutdown();

  const events = payloads.flatMap((payload) => payload.events);
  const outer = events.find((event) => event.name === "outer");
  const inner = events.find((event) => event.name === "inner");
  const manual = events.find((event) => event.name === "manual");
  const bad = events.find((event) => event.name === "bad");

  assert.ok(outer);
  assert.ok(inner);
  assert.ok(manual);
  assert.ok(bad);
  assert.equal(inner.parentId, outer.traceId);
  assert.equal(inner.rootTraceId, outer.traceId);
  assert.equal(manual.parentId, outer.traceId);
  assert.equal(manual.rootTraceId, outer.traceId);
  assert.equal(bad.severity, "critical");
});

test("trace becomes a no-op after shutdown", async () => {
  const payloads = createFetchStub();

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    autoCapture: false,
  });

  await HackTrace.trace("before-shutdown", async () => {});
  await HackTrace.shutdown();

  const beforeCount = payloads.flatMap((payload) => payload.events).length;
  await HackTrace.trace("after-shutdown", async () => {});
  const afterCount = payloads.flatMap((payload) => payload.events).length;

  assert.equal(afterCount, beforeCount);
});

after(() => {
  globalThis.fetch = originalFetch;
  globalThis.setInterval = originalSetInterval;
});
