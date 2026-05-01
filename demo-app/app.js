import "dotenv/config";
import express from "express";
import {
  init,
  trace,
  startSpan,
  endSpan,
  shutdown
} from "../sdk/dist/index.mjs";
import {
  runHealthySearchScenario,
  runCheckoutScenario,
  runSlowReportScenario,
  runImportScenario,
  runWebhookScenario,
  runRunAllScenario
} from "./src/scenarios.js";
import { renderHomePage } from "./src/templates.js";

const port = Number.parseInt(process.env.DEMO_PORT ?? "4010", 10);
const dashboardUrl = process.env.DEMO_DASHBOARD_URL ?? "http://localhost:3000";
const backendUrl = process.env.HACKTRACE_BASE_URL ?? "http://localhost:3001";
const ingestionEndpoint = process.env.HACKTRACE_ENDPOINT ?? `${backendUrl}/events`;
const apiKey = process.env.HACKTRACE_API_KEY ?? "test";

init({
  apiKey,
  endpoint: ingestionEndpoint,
  batchSize: 5,
  flushInterval: 2000,
  sampleRate: 1,
  autoCapture: false,
  environment: "development"
});

const app = express();
app.use(express.json());

function maskApiKey(value) {
  if (!value) {
    return "not-set";
  }

  if (value.length <= 4) {
    return `${"*".repeat(Math.max(value.length - 1, 0))}${value.slice(-1)}`;
  }

  return `${value.slice(0, 2)}${"*".repeat(value.length - 4)}${value.slice(-2)}`;
}

function scenarioRoute(name, handler) {
  return async (req, res) => {
    try {
      const result = await trace(name, () => handler(req), {
        metadata: {
          method: req.method,
          path: req.path,
          query: req.query
        },
        tags: ["demo-app", "scenario"]
      });

      res.json({
        ok: true,
        scenario: name,
        result
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        scenario: name,
        error: {
          name: error.name,
          message: error.message
        }
      });
    }
  };
}

app.get("/", async (_req, res) => {
  const statusSpan = startSpan("demo.home.render");

  try {
    res.type("html").send(
      renderHomePage({
        demoPort: port,
        backendUrl,
        dashboardUrl,
        ingestionEndpoint,
        apiKey: maskApiKey(apiKey)
      })
    );
  } finally {
    endSpan(statusSpan);
  }
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "hacktrace-demo-app"
  });
});

app.get(
  "/api/config",
  scenarioRoute("demo.config", async () => ({
    demoPort: port,
    backendUrl,
    dashboardUrl,
    ingestionEndpoint,
    apiKey: maskApiKey(apiKey)
  }))
);

app.get(
  "/api/scenarios/healthy-search",
  scenarioRoute("demo.healthy-search", (req) =>
    runHealthySearchScenario({
      query: String(req.query.query ?? "error grouping")
    })
  )
);

app.post(
  "/api/scenarios/checkout",
  scenarioRoute("demo.checkout", (req) =>
    runCheckoutScenario({
      failPayment:
        String(req.query.fail ?? req.body?.fail ?? "0") === "1"
    })
  )
);

app.get(
  "/api/scenarios/slow-report",
  scenarioRoute("demo.slow-report", (req) =>
    runSlowReportScenario({
      rows: Number.parseInt(String(req.query.rows ?? "250"), 10)
    })
  )
);

app.post(
  "/api/scenarios/import",
  scenarioRoute("demo.bulk-import", (req) =>
    runImportScenario({
      failRow:
        String(req.query.fail ?? req.body?.fail ?? "0") === "1"
    })
  )
);

app.post(
  "/api/scenarios/webhook",
  scenarioRoute("demo.webhook", (req) =>
    runWebhookScenario({
      failDatabase:
        String(req.query.fail ?? req.body?.fail ?? "0") === "1"
    })
  )
);

app.post(
  "/api/run-all",
  scenarioRoute("demo.run-all", async () =>
    runRunAllScenario()
  )
);

const server = app.listen(port, () => {
  console.log(`HackTrace demo app running at http://localhost:${port}`);
  console.log(`Tracing to ${ingestionEndpoint}`);
  console.log(`Inspect data in the dashboard at ${dashboardUrl}`);
});

async function closeServer() {
  await shutdown().catch(() => undefined);

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

process.on("SIGINT", async () => {
  await closeServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeServer();
  process.exit(0);
});
