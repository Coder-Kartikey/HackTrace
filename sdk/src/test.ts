import * as HackTrace from "hacktrace";

HackTrace.init({
  apiKey: "test",
  endpoint: "http://localhost",
});

HackTrace.trace("outer", async () => {
  await HackTrace.trace("inner", async () => {
    console.log("inside inner");
  });
});

setTimeout(() => {
  throw new Error("Node crash");
}, 1000);

setTimeout(() => {
  throw new Error("Browser crash test");
}, 1000);

Promise.reject(new Error("Unhandled promise"));

