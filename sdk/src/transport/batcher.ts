import { getState } from "../state";
import { addToBuffer, getBuffer, clearBuffer } from "./buffer";
import { sendBatch } from "./httpSender";
import { TraceEvent } from "../types";

let flushTimer: ReturnType<typeof setInterval> | undefined;
let batcherStarted = false;
let batcherShutdown = false;
const retryTimers = new Set<ReturnType<typeof setTimeout>>();

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

export function startBatcher() {
  if (batcherStarted && !batcherShutdown) {
    return;
  }

  const { config } = getState();
  batcherShutdown = false;
  batcherStarted = true;

  flushTimer = setInterval(() => {
    void flush();
  }, config.flushInterval);
}

export function stopBatcher() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = undefined;
  }

  batcherStarted = false;
}

export function processEvent(event: TraceEvent) {
  if (batcherShutdown) {
    console.warn("HackTrace: Ignoring event because the SDK has been shut down.");
    return;
  }

  addToBuffer(event);

  const { config } = getState();
  if (getBuffer().length >= config.batchSize) {
    void flush();
  }
}

export async function flush(retryCount = 0) {
  if (batcherShutdown && retryCount === 0) {
    return;
  }

  const events = getBuffer();
  if (!events.length) return;

  clearBuffer();

  try {
    await sendBatch(events);
  } catch (error) {
    if (!batcherShutdown && retryCount < MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, retryCount);
      const retryTimer = setTimeout(() => {
        retryTimers.delete(retryTimer);
        events.forEach(addToBuffer);
        void flush(retryCount + 1);
      }, delay);
      retryTimers.add(retryTimer);
    } else {
      console.error("HackTrace: Failed to send batch after retries.", error);
    }
  }
}

export async function shutdownTransport() {
  batcherShutdown = true;
  stopBatcher();

  for (const retryTimer of retryTimers) {
    clearTimeout(retryTimer);
  }
  retryTimers.clear();

  const events = getBuffer();
  if (!events.length) {
    return;
  }

  clearBuffer();
  await sendBatch(events);
}
