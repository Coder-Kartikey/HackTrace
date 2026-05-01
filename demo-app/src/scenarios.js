import { trace, startSpan, endSpan } from "../../sdk/dist/index.mjs";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class PaymentDeclinedError extends Error {
  constructor() {
    super("Card authorization rejected by processor");
    this.name = "PaymentDeclinedError";
  }
}

class CsvValidationError extends Error {
  constructor() {
    super("CSV row is missing required email field");
    this.name = "CsvValidationError";
  }
}

class DatabaseTimeoutError extends Error {
  constructor() {
    super("Inventory query exceeded 2500ms");
    this.name = "DatabaseTimeoutError";
  }
}

async function cachedLookup(query) {
  return trace(
    "search.cache-lookup",
    async () => {
      await sleep(30);
      return {
        hit: false,
        query
      };
    },
    {
      metadata: {
        query
      },
      tags: ["cache", "search"]
    }
  );
}

async function databaseSearch(query) {
  const connectionSpan = startSpan("db.connection");

  try {
    await sleep(40);
  } finally {
    endSpan(connectionSpan);
  }

  return trace(
    "search.db-query",
    async () => {
      await sleep(90);
      return [
        {
          id: "doc-1",
          title: `How to debug ${query}`,
          score: 0.98
        },
        {
          id: "doc-2",
          title: `Understanding traces for ${query}`,
          score: 0.92
        }
      ];
    },
    {
      metadata: {
        query,
        rows: 2
      },
      tags: ["database", "search"]
    }
  );
}

async function authorizePayment(failPayment) {
  const processorSpan = startSpan("payments.processor-http");

  try {
    await sleep(120);
  } finally {
    endSpan(processorSpan);
  }

  return trace(
    "payments.authorize",
    async () => {
      await sleep(60);

      if (failPayment) {
        throw new PaymentDeclinedError();
      }

      return {
        authorizationId: "pay_auth_demo_001",
        status: "approved"
      };
    },
    {
      metadata: {
        failPayment
      },
      tags: ["payments", "checkout"]
    }
  );
}

async function reserveInventory() {
  return trace(
    "inventory.reserve",
    async () => {
      await sleep(70);
      return {
        reservationId: "inv_res_demo_001",
        reserved: true
      };
    },
    {
      tags: ["inventory", "checkout"]
    }
  );
}

async function sendReceiptEmail() {
  return trace(
    "notifications.send-receipt",
    async () => {
      await sleep(35);
      return {
        delivered: true
      };
    },
    {
      tags: ["notifications", "checkout"]
    }
  );
}

async function buildReportChunk(chunkId, rows) {
  return trace(
    `reports.chunk-${chunkId}`,
    async () => {
      await sleep(55);
      return {
        chunkId,
        rows
      };
    },
    {
      metadata: {
        chunkId,
        rows
      },
      tags: ["reports"]
    }
  );
}

async function parseCsvRows(failRow) {
  return trace(
    "imports.parse-csv",
    async () => {
      await sleep(45);

      const rows = [
        { email: "alice@example.com", plan: "starter" },
        { email: "bob@example.com", plan: "growth" },
        { email: failRow ? "" : "carol@example.com", plan: "starter" }
      ];

      if (rows.some((row) => !row.email)) {
        throw new CsvValidationError();
      }

      return rows;
    },
    {
      metadata: {
        failRow
      },
      tags: ["imports", "csv"]
    }
  );
}

async function writeImportedUsers(rows) {
  return trace(
    "imports.write-users",
    async () => {
      await Promise.all(
        rows.map((row, index) =>
          trace(
            `imports.user-${index + 1}`,
            async () => {
              await sleep(25);
              return row.email;
            },
            {
              metadata: {
                email: row.email
              },
              tags: ["imports", "user-write"]
            }
          )
        )
      );

      return {
        imported: rows.length
      };
    },
    {
      metadata: {
        rows: rows.length
      },
      tags: ["imports", "database"]
    }
  );
}

async function storeWebhookEvent(failDatabase) {
  const connectionSpan = startSpan("webhook.db-connection");

  try {
    await sleep(35);
  } finally {
    endSpan(connectionSpan);
  }

  return trace(
    "webhook.store-event",
    async () => {
      await sleep(65);

      if (failDatabase) {
        throw new DatabaseTimeoutError();
      }

      return {
        stored: true
      };
    },
    {
      metadata: {
        failDatabase
      },
      tags: ["webhook", "database"]
    }
  );
}

export async function runHealthySearchScenario({ query }) {
  return trace(
    "scenario.healthy-search",
    async () => {
      const cache = await cachedLookup(query);
      const results = await databaseSearch(query);

      return {
        query,
        cache,
        results
      };
    },
    {
      metadata: {
        query
      },
      tags: ["demo", "healthy", "search"]
    }
  );
}

export async function runCheckoutScenario({ failPayment }) {
  return trace(
    "scenario.checkout",
    async () => {
      const [inventory, payment] = await Promise.all([
        reserveInventory(),
        authorizePayment(failPayment)
      ]);

      await sendReceiptEmail();

      return {
        inventory,
        payment,
        failPayment
      };
    },
    {
      metadata: {
        failPayment
      },
      tags: ["demo", "checkout"]
    }
  );
}

export async function runSlowReportScenario({ rows }) {
  return trace(
    "scenario.slow-report",
    async () => {
      const chunks = [
        await buildReportChunk(1, Math.ceil(rows / 3)),
        await buildReportChunk(2, Math.ceil(rows / 3)),
        await buildReportChunk(3, rows - Math.ceil(rows / 3) * 2)
      ];

      return {
        rows,
        chunks
      };
    },
    {
      metadata: {
        rows
      },
      tags: ["demo", "slow-report"]
    }
  );
}

export async function runImportScenario({ failRow }) {
  return trace(
    "scenario.bulk-import",
    async () => {
      const rows = await parseCsvRows(failRow);
      const result = await writeImportedUsers(rows);

      return {
        failRow,
        ...result
      };
    },
    {
      metadata: {
        failRow
      },
      tags: ["demo", "import"]
    }
  );
}

export async function runWebhookScenario({ failDatabase }) {
  return trace(
    "scenario.webhook",
    async () => {
      await trace(
        "webhook.verify-signature",
        async () => {
          await sleep(20);
          return true;
        },
        {
          tags: ["webhook", "security"]
        }
      );

      const result = await storeWebhookEvent(failDatabase);

      return {
        failDatabase,
        result
      };
    },
    {
      metadata: {
        failDatabase
      },
      tags: ["demo", "webhook"]
    }
  );
}

export async function runRunAllScenario() {
  const summary = [];

  summary.push(await runHealthySearchScenario({ query: "latency spikes" }));
  summary.push(await runSlowReportScenario({ rows: 320 }));

  try {
    await runCheckoutScenario({ failPayment: true });
  } catch (error) {
    summary.push({
      scenario: "checkout-failure",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }

  try {
    await runImportScenario({ failRow: true });
  } catch (error) {
    summary.push({
      scenario: "import-failure",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }

  try {
    await runWebhookScenario({ failDatabase: true });
  } catch (error) {
    summary.push({
      scenario: "webhook-failure",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }

  summary.push(await runCheckoutScenario({ failPayment: false }));

  return {
    generated: summary.length,
    summary
  };
}
