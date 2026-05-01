function scenarioCard({ title, description, method, path, body = "" }) {
  const escapedBody = body.replace(/"/g, "&quot;");

  return `
    <article class="card">
      <div class="card-copy">
        <p class="eyebrow">${method}</p>
        <h3>${title}</h3>
        <p>${description}</p>
        <code>${path}</code>
      </div>
      <button
        class="scenario-button"
        data-method="${method}"
        data-path="${path}"
        data-body="${escapedBody}"
      >
        Run scenario
      </button>
    </article>
  `;
}

export function renderHomePage({
  demoPort,
  backendUrl,
  dashboardUrl,
  ingestionEndpoint,
  apiKey
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HackTrace Demo App</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #08111f;
        --surface: #10213a;
        --surface-soft: #163050;
        --text: #edf4ff;
        --muted: #91a5c6;
        --border: rgba(173, 198, 255, 0.16);
        --accent: #6ee7c8;
        --accent-text: #07211c;
        --danger: #ff7b7b;
        --warning: #ffd27a;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Arial, Helvetica, sans-serif;
        background:
          radial-gradient(circle at top, rgba(110, 231, 200, 0.18), transparent 34%),
          linear-gradient(180deg, #08111f 0%, #07101d 100%);
        color: var(--text);
      }

      a {
        color: inherit;
      }

      .page {
        width: min(1200px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0 56px;
      }

      .hero,
      .panel,
      .card,
      .log {
        border: 1px solid var(--border);
        background: rgba(16, 33, 58, 0.92);
        border-radius: 24px;
      }

      .hero {
        padding: 28px;
        display: grid;
        gap: 24px;
      }

      .hero-grid,
      .stats,
      .scenario-grid,
      .footer-grid {
        display: grid;
        gap: 16px;
      }

      .hero-grid {
        grid-template-columns: 1.15fr 0.85fr;
      }

      .stats {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .scenario-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 24px;
      }

      .footer-grid {
        grid-template-columns: 1fr 1fr;
        margin-top: 24px;
      }

      .panel,
      .log {
        padding: 24px;
      }

      .eyebrow {
        margin: 0 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 11px;
        color: var(--muted);
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: clamp(34px, 5vw, 56px);
        line-height: 1.02;
      }

      h2 {
        font-size: 22px;
      }

      h3 {
        font-size: 18px;
      }

      .subtle {
        color: var(--muted);
        line-height: 1.6;
        max-width: 62ch;
      }

      .stats .panel {
        padding: 18px;
      }

      .value {
        display: block;
        margin-top: 12px;
        font-size: 18px;
        font-weight: 700;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      .button,
      .scenario-button {
        appearance: none;
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }

      .button:hover,
      .scenario-button:hover {
        transform: translateY(-1px);
        opacity: 0.96;
      }

      .button.primary,
      .scenario-button {
        background: var(--accent);
        color: var(--accent-text);
      }

      .button.secondary {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
      }

      .card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .card-copy {
        display: grid;
        gap: 10px;
      }

      code,
      pre {
        font-family: "Courier New", Courier, monospace;
      }

      code {
        color: var(--accent);
        word-break: break-word;
      }

      ul {
        margin: 14px 0 0;
        padding-left: 18px;
        color: var(--muted);
        line-height: 1.6;
      }

      .log {
        margin-top: 24px;
      }

      #log-output {
        margin-top: 16px;
        max-height: 420px;
        overflow: auto;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        padding: 16px;
        color: var(--text);
        line-height: 1.5;
      }

      .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .badge {
        border-radius: 999px;
        border: 1px solid var(--border);
        padding: 8px 12px;
        color: var(--muted);
        font-size: 13px;
      }

      .hint {
        margin-top: 14px;
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(255, 210, 122, 0.12);
        border: 1px solid rgba(255, 210, 122, 0.24);
        color: var(--warning);
      }

      @media (max-width: 980px) {
        .hero-grid,
        .stats,
        .scenario-grid,
        .footer-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div class="hero-grid">
          <div class="panel">
            <p class="eyebrow">HackTrace demo app</p>
            <h1>Generate real traces and grouped failures on demand.</h1>
            <p class="subtle" style="margin-top: 18px;">
              This app is safe to push to the repo. It does not contain any critical credentials,
              and it uses environment variables with local defaults to talk to HackTrace.
            </p>
            <div class="actions">
              <button class="button primary" data-method="POST" data-path="/api/run-all" data-body="">
                Populate the dashboard
              </button>
              <a class="button secondary" href="${dashboardUrl}" target="_blank" rel="noreferrer">
                Open HackTrace dashboard
              </a>
            </div>
            <div class="hint">
              Run the server on <code>${backendUrl}</code>, then open the dashboard after triggering scenarios here.
            </div>
          </div>

          <div class="panel">
            <p class="eyebrow">Current config</p>
            <h2>Local wiring</h2>
            <div class="badge-row">
              <span class="badge">Demo app: http://localhost:${demoPort}</span>
              <span class="badge">Backend: ${backendUrl}</span>
              <span class="badge">Events: ${ingestionEndpoint}</span>
              <span class="badge">API key: ${apiKey}</span>
            </div>
            <ul>
              <li>The checkout, import, and webhook flows generate grouped failures intentionally.</li>
              <li>The search and report flows generate clean nested traces for tree and timeline inspection.</li>
              <li>The "Populate the dashboard" action runs several scenarios in sequence so the UI has useful data quickly.</li>
            </ul>
          </div>
        </div>

        <div class="stats">
          <div class="panel">
            <p class="eyebrow">Scenario type</p>
            <span class="value">Healthy traces</span>
          </div>
          <div class="panel">
            <p class="eyebrow">Scenario type</p>
            <span class="value">Grouped errors</span>
          </div>
          <div class="panel">
            <p class="eyebrow">Scenario type</p>
            <span class="value">Manual spans</span>
          </div>
          <div class="panel">
            <p class="eyebrow">Scenario type</p>
            <span class="value">Concurrent work</span>
          </div>
        </div>
      </section>

      <section class="scenario-grid">
        ${scenarioCard({
          title: "Healthy search flow",
          description: "Cache miss plus database lookup. Good for verifying trace trees and metadata.",
          method: "GET",
          path: "/api/scenarios/healthy-search?query=latency"
        })}
        ${scenarioCard({
          title: "Checkout success",
          description: "Inventory reservation, payment authorization, and receipt delivery without failure.",
          method: "POST",
          path: "/api/scenarios/checkout",
          body: JSON.stringify({ fail: 0 })
        })}
        ${scenarioCard({
          title: "Checkout failure",
          description: "Payment processor rejection that should create a stable grouped error.",
          method: "POST",
          path: "/api/scenarios/checkout?fail=1",
          body: JSON.stringify({ fail: 1 })
        })}
        ${scenarioCard({
          title: "Slow report",
          description: "Longer-running report split into nested chunks for timeline inspection.",
          method: "GET",
          path: "/api/scenarios/slow-report?rows=480"
        })}
        ${scenarioCard({
          title: "Bulk import success",
          description: "CSV parse plus concurrent user writes to exercise nested traces and async work.",
          method: "POST",
          path: "/api/scenarios/import",
          body: JSON.stringify({ fail: 0 })
        })}
        ${scenarioCard({
          title: "Bulk import validation error",
          description: "Intentional CSV validation failure to create another grouped error family.",
          method: "POST",
          path: "/api/scenarios/import?fail=1",
          body: JSON.stringify({ fail: 1 })
        })}
        ${scenarioCard({
          title: "Webhook success",
          description: "Signature verification and database store path for a normal webhook flow.",
          method: "POST",
          path: "/api/scenarios/webhook",
          body: JSON.stringify({ fail: 0 })
        })}
        ${scenarioCard({
          title: "Webhook database timeout",
          description: "Intentional backend timeout error to generate a stable grouped issue.",
          method: "POST",
          path: "/api/scenarios/webhook?fail=1",
          body: JSON.stringify({ fail: 1 })
        })}
      </section>

      <section class="footer-grid">
        <div class="panel">
          <p class="eyebrow">Expected dashboard outcome</p>
          <h2>What you should see in HackTrace</h2>
          <ul>
            <li>New grouped errors for payment, CSV validation, and database timeout flows</li>
            <li>Nested trace trees for the search, report, checkout, import, and webhook scenarios</li>
            <li>Useful metadata and tags on spans and scenario roots</li>
            <li>Enough trend data to exercise the overview, errors explorer, and trace viewer</li>
          </ul>
        </div>

        <div class="panel">
          <p class="eyebrow">Safe by design</p>
          <h2>What is intentionally not here</h2>
          <ul>
            <li>No production secrets or live external services</li>
            <li>No hardcoded private credentials</li>
            <li>No unstable global crash scenario that kills the demo process</li>
            <li>No dependency on the old mock server</li>
          </ul>
        </div>
      </section>

      <section class="log">
        <p class="eyebrow">Run log</p>
        <h2>Scenario output</h2>
        <pre id="log-output">Click a scenario button to run the flow and inspect the response here.</pre>
      </section>
    </main>

    <script>
      const logOutput = document.getElementById("log-output");

      function writeLog(label, payload) {
        logOutput.textContent = "[" + new Date().toLocaleTimeString() + "] " + label + "\\n\\n" + JSON.stringify(payload, null, 2);
      }

      async function runScenario(method, path, rawBody) {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json"
          }
        };

        if (method !== "GET" && rawBody) {
          options.body = rawBody;
        }

        writeLog("Running " + method + " " + path, { pending: true });

        try {
          const response = await fetch(path, options);
          const payload = await response.json();
          writeLog(method + " " + path, {
            status: response.status,
            payload
          });
        } catch (error) {
          writeLog(method + " " + path, {
            error: error.message
          });
        }
      }

      document.querySelectorAll("[data-path]").forEach((node) => {
        node.addEventListener("click", () => {
          runScenario(
            node.getAttribute("data-method"),
            node.getAttribute("data-path"),
            node.getAttribute("data-body")
          );
        });
      });
    </script>
  </body>
</html>`;
}
