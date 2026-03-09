import { getState } from "../state";
import { addToBuffer, getBuffer, clearBuffer } from "./buffer";
import { sendBatch } from "./httpSender";
import { TraceEvent } from "../types";

let flushTimer: any;

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;


export function startBatcher() {
  const { config } = getState();

  flushTimer = setInterval(() => {
    flush();
  }, config.flushInterval);
}

export function stopBatcher() {
  if (flushTimer) {
    clearInterval(flushTimer);
  }
}

export function processEvent(event: TraceEvent) {
  addToBuffer(event);

  const { config } = getState();

  if (getBuffer().length >= config.batchSize) {
    flush();
  }
}

export async function flush(retryCount = 0) {
  const events = getBuffer();
  if (!events.length) return;

  clearBuffer();

  try {
    await sendBatch(events);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = BASE_DELAY * Math.pow(2, retryCount);

      setTimeout(() => {
        // re-add events before retry
        events.forEach(addToBuffer);
        flush(retryCount + 1);
      }, delay);
    } else {
      console.error("HackTrace: Failed to send batch after retries.");
    }
  }
}

export async function shutdown() {
  stopBatcher();
  await flush();
}
