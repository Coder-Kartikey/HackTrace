import test, { after } from "node:test";
import assert from "node:assert/strict";

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const originalFetch = globalThis.fetch;

function installBrowserGlobals() {
  const listeners = new Map();

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: {
      document: {},
      setTimeout: globalThis.setTimeout.bind(globalThis),
      setInterval: globalThis.setInterval.bind(globalThis),
      clearTimeout: globalThis.clearTimeout.bind(globalThis),
      clearInterval: globalThis.clearInterval.bind(globalThis),
      queueMicrotask: globalThis.queueMicrotask.bind(globalThis),
      addEventListener(type, listener) {
        listeners.set(type, listener);
      },
      removeEventListener(type) {
        listeners.delete(type);
      },
    },
  });

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    writable: true,
    value: { onLine: true },
  });

  return listeners;
}

test("browser runtime keeps overlapping callback-based trace trees isolated", async () => {
  installBrowserGlobals();

  const payloads = [];
  globalThis.fetch = async (_url, options = {}) => {
    payloads.push(JSON.parse(options.body));
    return {
      ok: true,
      status: 200,
    };
  };

  const HackTrace = await import("../dist/index.mjs");

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost:3001/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    environment: "development",
    autoCapture: false,
  });

  await Promise.all([
    HackTrace.trace("root-a", () => new Promise((resolve) => {
      window.setTimeout(() => {
        void HackTrace.trace("child-a", async () => {
          await new Promise((innerResolve) => window.setTimeout(innerResolve, 5));
        }).then(resolve);
      }, 15);
    })),
    HackTrace.trace("root-b", () => new Promise((resolve) => {
      window.setTimeout(() => {
        void HackTrace.trace("child-b", async () => {
          await new Promise((innerResolve) => window.setTimeout(innerResolve, 1));
          window.queueMicrotask(() => {});
        }).then(resolve);
      }, 1);
    })),
  ]);

  await HackTrace.shutdown();

  const events = payloads.flatMap((payload) => payload.events);
  const rootA = events.find((event) => event.name === "root-a");
  const rootB = events.find((event) => event.name === "root-b");
  const childA = events.find((event) => event.name === "child-a");
  const childB = events.find((event) => event.name === "child-b");

  assert.ok(rootA);
  assert.ok(rootB);
  assert.ok(childA);
  assert.ok(childB);
  assert.equal(childA.parentId, rootA.traceId);
  assert.equal(childA.rootTraceId, rootA.traceId);
  assert.equal(childB.parentId, rootB.traceId);
  assert.equal(childB.rootTraceId, rootB.traceId);
  assert.notEqual(childA.rootTraceId, childB.rootTraceId);
  assert.equal(childA.environment.runtime, "browser");
  assert.equal(childB.environment.runtime, "browser");
});

test("browser runtime supports a bound promise continuation after an async boundary", async () => {
  installBrowserGlobals();

  const payloads = [];
  globalThis.fetch = async (_url, options = {}) => {
    payloads.push(JSON.parse(options.body));
    return {
      ok: true,
      status: 200,
    };
  };

  const HackTrace = await import("../dist/index.mjs");

  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost:3001/events",
    batchSize: 20,
    flushInterval: 10_000,
    sampleRate: 1,
    environment: "development",
    autoCapture: false,
  });

  await HackTrace.trace("await-root-a", async () => {
    const continueA = HackTrace.bindContext(() => HackTrace.trace("await-child-a", async () => {
      await Promise.resolve("child-a");
    }));

    await new Promise((resolve) => window.setTimeout(resolve, 15));
    await Promise.resolve("resume-a").then(continueA);
  });

  await HackTrace.shutdown();

  const events = payloads.flatMap((payload) => payload.events);
  const rootA = events.find((event) => event.name === "await-root-a");
  const childA = events.find((event) => event.name === "await-child-a");

  assert.ok(rootA);
  assert.ok(childA);
  assert.equal(childA.parentId, rootA.traceId);
  assert.equal(childA.rootTraceId, rootA.traceId);
});

after(() => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
  } else {
    delete globalThis.window;
  }

  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, "navigator", originalNavigatorDescriptor);
  } else {
    delete globalThis.navigator;
  }

  globalThis.fetch = originalFetch;
});
