// const express = require("express");
import express from "express";

const app = express();
app.use(express.json());


app.post("/events", (req, res) => {
  // console.log("Fetch exists:", typeof fetch);
  console.log("📦 Received batch:");
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send({ status: "ok" });
});

app.listen(3000, () => {
  console.log("🚀 Mock server running on http://localhost:3000");
});
