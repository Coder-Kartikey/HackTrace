# HackTrace SDK

HackTrace is a tracing SDK for Node.js and browser environments. It captures:

- traced function execution
- manual spans
- runtime metadata
- classified errors with normalized fingerprints
- global uncaught errors when `autoCapture` is enabled

## Installation

```bash
npm install hacktrace
```

Node.js `18+` is recommended because the SDK expects `fetch` to exist at runtime.

## Public API

### `init(config)`

Initializes the SDK.

```ts
import * as HackTrace from "hacktrace";

HackTrace.init({
  apiKey: "test",
  endpoint: "http://localhost:3001/events",
  batchSize: 20,
  flushInterval: 5000,
  sampleRate: 1,
  environment: "development",
  autoCapture: true,
});
```

Config fields:

- `apiKey`: required API key sent as `x-api-key`
- `endpoint`: required full ingestion URL, usually `http://localhost:3001/events`
- `sampleRate`: optional number from `0` to `1`
- `batchSize`: optional positive integer
- `flushInterval`: optional positive integer in milliseconds
- `environment`: optional app environment label
- `autoCapture`: optional boolean for global runtime errors

`init()` is idempotent. Repeated calls while active do not create duplicate timers or duplicate global listeners.

### `trace(name, fn, options?)`

Wraps sync or async work and reports duration, hierarchy, and status.

```ts
await HackTrace.trace("load-users", async () => {
  await fetchUsers();
});
```

Options:

- `metadata`: arbitrary JSON-safe object
- `tags`: array of string tags

### `startSpan(name)` / `endSpan(id?)`

Creates manual spans when you need more control than `trace()`.

```ts
const spanId = HackTrace.startSpan("db-query");
await queryDatabase();
HackTrace.endSpan(spanId);
```

Manual spans must be closed in stack order.

### `flush()`

Immediately attempts to send the current buffered events.

### `shutdown()`

Stops timers, removes auto-capture handlers, flushes remaining events, and makes future `trace()` calls behave like pass-through no-ops.

### `bindContext(fn)`

Returns a callback bound to the currently active trace context.

This is mainly useful in browser code when you need to carry trace context into a later callback or promise continuation that is not automatically preserved.

```ts
const continueTrace = HackTrace.bindContext(() =>
  HackTrace.trace("render-step", async () => {
    await doWork();
  })
);

await waitForSomething();
await Promise.resolve().then(continueTrace);
```

Capture the bound continuation before leaving the active trace context.

## Event Shape

The backend expects batched payloads in this shape:

```json
{
  "events": [
    {
      "traceId": "trace-1",
      "parentId": "trace-0",
      "rootTraceId": "trace-0",
      "sessionId": "session-1",
      "name": "load-users",
      "type": "function",
      "status": "error",
      "severity": "critical",
      "timestamp": 1760000000000,
      "duration": 42.5,
      "error": {
        "name": "ReferenceError",
        "message": "x is not defined",
        "stack": "ReferenceError: ...",
        "fingerprint": "123456"
      },
      "metadata": {
        "userId": "abc"
      },
      "tags": ["users", "page-load"],
      "environment": {
        "runtime": "node",
        "sdkVersion": "2.0.0",
        "appEnvironment": "development"
      }
    }
  ]
}
```

## Development

```bash
npm run build
npm test
```

## Release Readiness

Current release-hardening already in place:

- idempotent init
- lifecycle-safe shutdown
- buffered transport with retries
- unified fingerprinting and severity classification
- regression tests covering lifecycle, hierarchy, and shutdown behavior

Recommended before publishing externally:

- run `npm pack` and inspect package contents
- confirm README examples against a real local server
- verify browser async context behavior in a real app integration, especially raw async/await continuation behavior
