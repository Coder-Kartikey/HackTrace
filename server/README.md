# HackTrace Server

HackTrace Server is the ingestion and analytics API for HackTrace events.

It is responsible for:

- validating incoming event batches
- enforcing configured API keys
- storing raw trace events
- grouping repeated errors by fingerprint
- serving analytics and trace-detail endpoints for the dashboard

## Requirements

- Node.js `18+`
- MongoDB

## Environment

Copy `.env.example` to `.env` and adjust values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hacktrace
PORT=3001
API_KEYS=test
```

Notes:

- `API_KEYS` is a comma-separated list of valid keys.
- The SDK should send one of those keys through the `x-api-key` header.

## Scripts

```bash
npm start
```

Starts the server with `node src/server.js`.

```bash
npm run dev
```

Starts the server with `nodemon`.

```bash
npm test
```

Runs backend regression tests for auth, payload validation, and ingestion grouping behavior.

## Routes

- `GET /health`
- `POST /events`
- `GET /errors`
- `GET /errors/:fingerprint`
- `GET /analytics/top-errors`
- `GET /analytics/error-trend`
- `GET /traces/:traceId`

All routes except `/health` require a valid `x-api-key` header.

For the full request and response contract, see [../docs/API-CONTRACT.md](../docs/API-CONTRACT.md).
