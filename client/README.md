# HackTrace Client

This frontend is the investigation workspace for HackTrace. It is built with Next.js App Router and is designed to help developers:

- see what is breaking right now
- triage grouped errors quickly
- inspect a failing trace end to end
- onboard the SDK without leaving the product

## Routes

- `/` overview dashboard
- `/errors` grouped error explorer
- `/errors/[fingerprint]` grouped error investigation
- `/traces/[traceId]` full trace viewer
- `/setup` SDK onboarding and verification
- `/settings` frontend configuration reference

## Environment

Create a local `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
HACKTRACE_API_KEY=test
```

The client talks to the backend contract documented in [docs/API-CONTRACT.md](../docs/API-CONTRACT.md).

## Development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
```

## Frontend Workflow

1. Overview shows health, top errors, trend, severity mix, and investigation queue.
2. Errors explorer uses URL-driven filters for search, severity, environment, sort, and time range.
3. Error detail combines grouped summary, stack trace, recent events, environment info, occurrence sample, and related trace preview.
4. Trace view supports tree navigation, timeline inspection, span search, metadata inspection, and URL-linked focused spans.
5. Setup helps developers install the SDK, initialize it, send a test failure, and verify backend connectivity.

## Notes

- The dashboard is env-driven now and no longer hardcodes API values in source.
- The trace view syncs the selected span using the `focus` query param.
- Setup snippets are copyable from the UI to speed up onboarding.
