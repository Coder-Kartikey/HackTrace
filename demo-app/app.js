// const axios = require("axios");
// const {
//   startTrace,
//   stopTrace,
//   traceFn
// } = require("../sdk/hacktrace");

// startTrace({
//   label: "User fetch flow (pattern test)"
// });

// const fetchFromDB = traceFn("fetchFromDB", async () => {
//   await new Promise((res) => setTimeout(res, 100));
//   parseUser();
// });

// const parseUser = traceFn("parseUser", () => {
//   throw new Error("User ID missing");
// });

// const getUser = traceFn("getUser", async () => {
//   await fetchFromDB();
// });

// async function run() {
//   try {
//     await getUser();
//   } catch (err) {
//     const payload = stopTrace();

//     await axios.post("http://localhost:5000/api/traces", {
//       trace: payload.trace,
//       session: payload.session,
//       source: "demo-app"
//     });

//     console.log("✅ Trace with pattern sent");
//   }
// }

// run();






import * as HackTrace from "./../sdk-v2/dist/index.mjs";
async function run() {
HackTrace.init({
  apiKey: "test",
  endpoint: "http://127.0.0.1:3000/events",
  batchSize: 3,
  flushInterval: 2000,
  sampleRate: 1,
  autoCapture: true
});

// await Promise.all(
//   Array.from({ length: 20 }).map((_, i) =>
//     HackTrace.trace(`req-${i}`, async () => {
//       await new Promise(r => setTimeout(r, Math.random() * 100));
//       await HackTrace.trace(`req-${i}-inner`, async () => {});
//     })
//   )
// );

await HackTrace.trace("browser-basic", () => {
  console.log("Hello world");
});

// fetch("http://localhost:3000/events", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ test: "direct" })
// })
// .then(res => res.text())
// .then(console.log)
// .catch(console.error);

// await HackTrace.trace("outer", async () => {
//   await HackTrace.trace("inner", async () => {
//     await new Promise(r => setTimeout(r, 100));
//   });
// });
await HackTrace.trace("errorTest", () => {
  throw new Error("Manual error test");
});
await new Promise(r => setTimeout(() => {
  throw new Error("Global browser crash");
}, 1000));
await HackTrace.trace("errorTest", () => {
  throw new Error("Backend grouping test");
});
// await new Promise(r => setTimeout(() => {
//   throw new Error("Global browser crash");
// }, 500));
// await new Promise(r => setTimeout(() => {
//   throw new Error("Global browser crash");
// }, 500));

// for (let i = 0; i < 10; i++) {
//   await HackTrace.trace("spam", () => {});
// }



// setTimeout(() => {
//   throw new Error("Browser crash test");
// }, 1000);

await HackTrace.shutdown();

}

run();