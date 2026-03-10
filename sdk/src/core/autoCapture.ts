import { getState } from "../state";
import { generateId } from "./id";
import { buildEvent } from "./eventBuilder";
import { processEvent } from "../transport/batcher";

// const capturedFingerprints = new Set<string>();
const fingerprintCache = new Map<string, number>();
const DEDUPE_WINDOW = 60_000; // 1 minute


export function setupAutoCapture() {
  const { runtime, config } = getState();

  if (!config.autoCapture) return;

  if (runtime === "browser") {
    setupBrowserHandlers();
  } else {
    setupNodeHandlers();
  }
}

function setupBrowserHandlers() {
  window.addEventListener("error", (event) => {
    if (!event.error) return;

    captureGlobalError(event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (!event.reason) return;

    captureGlobalError(event.reason);
  });
}

type NodeProcessLike = {
  on(event: "uncaughtException", listener: (error: unknown) => void): void;
  on(event: "unhandledRejection", listener: (reason: unknown) => void): void;
};

function setupNodeHandlers() {
  const proc = (globalThis as { process?: NodeProcessLike }).process;
  if (!proc?.on) return;

  proc.on("uncaughtException", (error) => {
    captureGlobalError(error);
  });

  proc.on("unhandledRejection", (reason: any) => {
    captureGlobalError(reason);
  });
}

function captureGlobalError(error: any) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  const fingerprint = generateFingerprint(error);

  const now = Date.now();
  const lastSeen = fingerprintCache.get(fingerprint);

  // Deduplication
  if (lastSeen && now - lastSeen < DEDUPE_WINDOW) {
    return; // Skip duplicate within time window
  }

  fingerprintCache.set(fingerprint, now);
  cleanupOldFingerprints(now);

  const traceId = generateId();

  const event = buildEvent({
    traceId,
    name: "GlobalError",
    type: "manual",
    status: "error",
    duration: 0,
    error,
  });

  // Force critical severity
  event.severity = "critical";

  processEvent(event);
}

function cleanupOldFingerprints(currentTime: number) {
  for (const [key, timestamp] of fingerprintCache.entries()) {
    if (currentTime - timestamp > DEDUPE_WINDOW) {
      fingerprintCache.delete(key);
    }
  }
}


function generateFingerprint(error: Error): string {
  const base = error.message + (error.stack?.split("\n")[1] || "");
  return hash(base);
}

function hash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}
