require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./db/mongo");
const traceRoutes = require("./routes/traceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/traces", traceRoutes);

connectDB();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
