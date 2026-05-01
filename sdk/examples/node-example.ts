import * as HackTrace from "hacktrace";

async function main() {
  HackTrace.init({
    apiKey: "test",
    endpoint: "http://localhost:3001/events",
    batchSize: 10,
    flushInterval: 2000,
    sampleRate: 1,
    environment: "development",
    autoCapture: true,
  });

  await HackTrace.trace("outer", async () => {
    await HackTrace.trace("inner", async () => {
      console.log("inside inner");
    });
  });

  await HackTrace.shutdown();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
