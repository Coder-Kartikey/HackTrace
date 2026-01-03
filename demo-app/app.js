const axios = require("axios");
const { startTrace, traceFn, getTrace } = require("../sdk/hacktrace");

startTrace();

const getUser = traceFn("getUser", () => {
  fetchFromDB();
});

const fetchFromDB = traceFn("fetchFromDB", () => {
  parseUser();
});

const parseUser = traceFn("parseUser", () => {
  throw new Error("User ID missing");
});

async function run() {
  try {
    getUser();
  } catch (err) {
    const trace = getTrace();

    await axios.post("http://localhost:5000/api/traces", {
      trace,
      source: "demo-app"
    });

    console.log("✅ Trace sent to backend");
  }
}

run();
