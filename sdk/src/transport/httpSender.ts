import { TraceEvent } from "../types";
import { getState } from "../state";

export async function sendBatch(events: TraceEvent[]): Promise<void> {
  const { config } = getState();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  if (typeof window !== "undefined" && typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error("Offline: Cannot send events.");
  }

  try {
    console.log("Sending to:", config.endpoint);
    console.log("Payload size:", events.length);
    console.log("SENDING BATCH:", JSON.stringify(events, null, 2));
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
      },
      body: JSON.stringify({ events }),
      signal: controller.signal,
    });
    console.log("Response status:", response.status);

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}
