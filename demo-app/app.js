const axios = require("axios");
const { startTrace, stopTrace, traceFn } = require("../sdk/hacktrace");

startTrace({
  label: "User fetch flow (async)"
});

const fetchFromDB = traceFn("fetchFromDB", async () => {
  await new Promise((res) => setTimeout(res, 100));
  parseUser();
});

const parseUser = traceFn("parseUser", () => {
  throw new Error("User ID missing");
});

const getUser = traceFn("getUser", async () => {
  await fetchFromDB();
});

async function run() {
  try {
    await getUser();
  } catch (err) {
    const payload = stopTrace();

    await axios.post("http://localhost:5000/api/traces", {
      ...payload,
      source: "demo-app"
    });

    console.log("✅ Session trace sent");
  }
}

run();
