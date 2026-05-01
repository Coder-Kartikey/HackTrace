# HackTrace API Contract

This document describes the current backend contract that the SDK and dashboard should treat as stable during ongoing product work.

## Base URL

Local default:

```text
http://localhost:3001
```

## Authentication

All routes except `GET /health` require:

```http
x-api-key: <configured-api-key>
```

Configured keys are loaded from `server/.env` using `API_KEYS`.

## Routes

### `GET /health`

Health probe.

Response:

```json
{
  "status": "ok"
}
```

### `POST /events`

Ingests a batch of trace events.

Request headers:

```http
Content-Type: application/json
x-api-key: test
```

Request body:

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
        "fingerprint": "12345",
        "name": "ReferenceError",
        "message": "x is not defined",
        "stack": "ReferenceError: ..."
      },
      "metadata": {
        "route": "/users"
      },
      "tags": ["users"],
      "environment": {
        "runtime": "node",
        "sdkVersion": "2.0.0",
        "appEnvironment": "development"
      }
    }
  ]
}
```

Validation rules:

- `events` must be a non-empty array
- each event must contain `traceId`, `sessionId`, `name`, `type`, `status`, `severity`, `timestamp`, `duration`, and `environment`
- valid `type`: `function`, `span`, `manual`
- valid `status`: `success`, `error`
- valid `severity`: `info`, `warning`, `critical`
- valid `environment.runtime`: `browser`, `node`
- `metadata`, when present, must be an object
- `tags`, when present, must be an array of strings
- `error` is required when `status === "error"`

Success response:

```json
{
  "success": true
}
```

Validation error response:

```json
{
  "error": "Invalid payload",
  "details": [
    "events[0].traceId is required"
  ]
}
```

### `GET /errors`

Returns grouped errors for the current API key.

Query params:

- `page`: optional, default `1`

Response:

```json
[
  {
    "_id": "...",
    "apiKey": "test",
    "fingerprint": "12345",
    "errorName": "ReferenceError",
    "message": "x is not defined",
    "firstSeen": "2026-01-01T10:00:00.000Z",
    "lastSeen": "2026-01-01T12:00:00.000Z",
    "occurrences": 3,
    "severity": "critical",
    "affectedFunctions": ["load-users"],
    "environments": ["development", "production"]
  }
]
```

### `GET /errors/:fingerprint`

Returns one grouped error plus recent related raw events.

Response:

```json
{
  "group": {
    "_id": "...",
    "fingerprint": "12345",
    "errorName": "ReferenceError",
    "message": "x is not defined",
    "firstSeen": "2026-01-01T10:00:00.000Z",
    "lastSeen": "2026-01-01T12:00:00.000Z",
    "occurrences": 3,
    "severity": "critical"
  },
  "recentEvents": [
    {
      "_id": "...",
      "traceId": "trace-1",
      "rootTraceId": "trace-0",
      "name": "load-users",
      "status": "error"
    }
  ]
}
```

### `GET /analytics/top-errors`

Returns the five highest-occurrence error groups for the current API key.

### `GET /analytics/error-trend`

Returns daily error counts for the current API key.

Response:

```json
[
  {
    "_id": "2026-01-01",
    "count": 5
  }
]
```

### `GET /traces/:traceId`

Returns all raw events that belong to the same `rootTraceId` as the requested event, ordered by timestamp and creation order.

Response:

```json
[
  {
    "_id": "...",
    "traceId": "trace-0",
    "rootTraceId": "trace-0",
    "parentId": null,
    "name": "outer",
    "type": "function",
    "status": "success",
    "timestamp": "2026-01-01T12:00:00.000Z"
  },
  {
    "_id": "...",
    "traceId": "trace-1",
    "rootTraceId": "trace-0",
    "parentId": "trace-0",
    "name": "inner",
    "type": "function",
    "status": "success",
    "timestamp": "2026-01-01T12:00:00.020Z"
  }
]
```

## Stability Guidance

These shapes should be treated as the shared contract across SDK, backend, and frontend. If we need to change them later, we should update this document first and then update both producers and consumers together.
