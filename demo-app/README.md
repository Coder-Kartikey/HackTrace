# HackTrace Demo App

This demo app is a safe local sample service that uses the HackTrace SDK to generate:

- healthy nested traces
- manual spans
- concurrent trace work
- stable grouped errors for dashboard testing

It is meant to help test HackTrace end to end:

`demo-app -> sdk -> server -> client`

## What It Does

The app serves a local browser UI with buttons that trigger demo scenarios such as:

- healthy search flow
- successful checkout
- failed checkout
- slow report generation
- successful bulk import
- failed bulk import
- successful webhook processing
- failed webhook processing

These scenarios create data that should appear in the HackTrace dashboard.

## Safety

- No critical credentials are committed.
- All configuration uses environment variables with safe local defaults.
- The default API key is `test`, which matches the local server example config.
- The demo does not call real payment, email, or external production services.

## Environment

Copy `.env.example` to `.env` if you want to override defaults:

```bash
DEMO_PORT=4010
DEMO_DASHBOARD_URL=http://localhost:3000
HACKTRACE_BASE_URL=http://localhost:3001
HACKTRACE_ENDPOINT=http://localhost:3001/events
HACKTRACE_API_KEY=test
```

## Run

Make sure the HackTrace backend is running first, then:

```bash
cd demo-app
npm install
npm run dev
```

Open:

```text
http://localhost:4010
```

Then trigger scenarios from the demo UI and inspect the results in the HackTrace frontend dashboard.

## Notes

- `npm run dev` and `npm start` both rebuild the local SDK first so the demo always uses the current SDK code.
- The demo imports the local repo SDK build from `../sdk/dist/index.mjs`.
