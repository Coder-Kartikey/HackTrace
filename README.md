# HackTrace

HackTrace is an error-tracing stack with three active layers working together:

- `sdk/`: captures traced work, span hierarchy, runtime metadata, and grouped error fingerprints
- `server/`: ingests events, stores raw traces, groups repeated failures, and serves analytics
- `client/`: gives developers a dashboard to onboard the SDK, triage issues, inspect grouped failures, and investigate traces

There is also a `demo-app/` script for local experimentation and an `oldVersions/` folder kept only as historical reference.

## Current Product Workflow

1. An app initializes the SDK with an API key and backend ingestion URL.
2. The app wraps meaningful work with `trace()` or manual spans.
3. The SDK captures timing, parent-child relationships, status, runtime context, and normalized error fingerprints.
4. Batched events are sent to `POST /events` on the backend.
5. The backend stores raw `TraceEvent` records and upserts grouped `ErrorGroup` summaries.
6. The frontend reads analytics, grouped issues, recent failing events, and full traces from the backend.
7. A developer uses the dashboard to move from:
   - "what is broken?"
   - to "where is it happening?"
   - to "what trace explains it?"

## Current Frontend Workflow

The dashboard is no longer just a smoke-test UI. It now supports:

- overview dashboard with health, trend, top errors, severity mix, and investigation queue
- grouped errors explorer with URL-driven filters
- grouped error detail with stack trace, environment context, recent events, and related trace preview
- trace viewer with tree, timeline, span browser, metadata panel, and focused-span URL state
- setup page with SDK onboarding snippets and troubleshooting
- settings page for frontend/backend configuration visibility

## Tech Stack

### SDK

- TypeScript
- `tsup`
- Node `AsyncLocalStorage`
- browser context helpers and `bindContext()`
- buffered `fetch` transport

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- dotenv

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts

## Docs

- SDK guide: [sdk/README.md](./sdk/README.md)
- Backend guide: [server/README.md](./server/README.md)
- Frontend guide: [client/README.md](./client/README.md)
- API contract: [docs/API-CONTRACT.md](./docs/API-CONTRACT.md)
- readiness and follow-up notes: [docs/PRE-FRONTEND-CHECKLIST.md](./docs/PRE-FRONTEND-CHECKLIST.md)

## Local Setup

### Server

```bash
cd server
cp .env.example .env
npm install
npm start
```

Defaults:

- API: `http://localhost:3001`
- health check: `GET /health`
- API key: `test`

### SDK

```bash
cd sdk
npm install
npm test
```

### Client

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

### Demo App

```bash
cd demo-app
npm install
node app.js
```

## Verification

SDK:

```bash
cd sdk
npm test
```

Backend:

```bash
cd server
npm test
```

Frontend:

```bash
cd client
npm run build
npm run lint
```

## Notes

- `server/.env` now contains safe local placeholder values, but any previously exposed real database credential still needs to be rotated outside the repo.
- The frontend is now ready enough for real iteration. Remaining work is mostly refinement and future product expansion, not missing foundation.
