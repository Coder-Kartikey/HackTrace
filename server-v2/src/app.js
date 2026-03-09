const express = require("express");
const cors = require("cors");

const eventsRoute = require("./routes/events");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoute);

module.exports = app;