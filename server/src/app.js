const express = require("express");
const cors = require("cors");

const eventsRoute = require("./routes/events");
const errorsRoute = require("./routes/errors");
const analyticsRoute = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoute);
app.use("/errors", errorsRoute);
app.use("/analytics", analyticsRoute);

module.exports = app;