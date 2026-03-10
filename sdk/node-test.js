import * as HackTrace from "./dist/index.mjs";

async function run() {
  HackTrace.init({
    apiKey: "test",
    endpoint: "http://127.0.0.1:3000/events",
    batchSize: 10,
    flushInterval: 5000
  });

//   await HackTrace.trace("largeMeta", () => {}, {
//     metadata: { big: "x".repeat(10000) }
//   });

// await HackTrace.trace("stringError", () => {
//   throw "string error";
// });

  await Promise.all([
    HackTrace.trace("req1", async () => {
      await new Promise(r => setTimeout(r, 100));
      await HackTrace.trace("req1-inner", async () => {});
    }),
    HackTrace.trace("req2", async () => {
      await new Promise(r => setTimeout(r, 50));
      await HackTrace.trace("req2-inner", async () => {});
    })
  ]);

  await HackTrace.shutdown();

  await HackTrace.trace("after-shutdown", async () => {});
}

run();