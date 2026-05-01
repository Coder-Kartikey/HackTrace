const express = require("express");
const cors = require("cors");
const { requireApiKey } = require("./middleware/requireApiKey");

const eventsRoute = require("./routes/events");
const errorsRoute = require("./routes/errors");
const analyticsRoute = require("./routes/analytics");
const tracesRoute = require("./routes/traces");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/events", requireApiKey, eventsRoute);
app.use("/errors", requireApiKey, errorsRoute);
app.use("/analytics", requireApiKey, analyticsRoute);
app.use("/traces", requireApiKey, tracesRoute);

module.exports = app;
