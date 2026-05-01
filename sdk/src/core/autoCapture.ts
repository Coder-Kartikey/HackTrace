import { getState } from "../state";
import { buildEvent } from "./eventBuilder";
import { processEvent } from "../transport/batcher";
import { generateFingerprint } from "../intelligence/fingerprint";
import { generateId } from "./id";

const fingerprintCache = new Map<string, number>();
const DEDUPE_WINDOW = 60_000;
let cleanupListeners: (() => void) | null = null;

export function setupAutoCapture() {
  const { runtime, config } = getState();

  if (cleanupListeners || !config.autoCapture) {
    return cleanupListeners;
  }

  cleanupListeners = runtime === "browser"
    ? setupBrowserHandlers()
    : setupNodeHandlers();

  return cleanupListeners;
}

export function teardownAutoCapture(): void {
  cleanupListeners?.();
  cleanupListeners = null;
}

function setupBrowserHandlers() {
  const onError = (event: ErrorEvent) => {
    if (!event.error) return;
    captureGlobalError(event.error);
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (!event.reason) return;
    captureGlobalError(event.reason);
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}

type NodeProcessLike = {
  on(event: "uncaughtException", listener: (error: unknown) => void): void;
  on(event: "unhandledRejection", listener: (reason: unknown) => void): void;
  off?(event: "uncaughtException", listener: (error: unknown) => void): void;
  off?(event: "unhandledRejection", listener: (reason: unknown) => void): void;
  removeListener?(event: "uncaughtException", listener: (error: unknown) => void): void;
  removeListener?(event: "unhandledRejection", listener: (reason: unknown) => void): void;
};

function setupNodeHandlers() {
  const proc = (globalThis as { process?: NodeProcessLike }).process;
  if (!proc?.on) {
    return () => undefined;
  }

  const onUncaughtException = (error: unknown) => {
    captureGlobalError(error);
  };

  const onUnhandledRejection = (reason: unknown) => {
    captureGlobalError(reason);
  };

  proc.on("uncaughtException", onUncaughtException);
  proc.on("unhandledRejection", onUnhandledRejection);

  return () => {
    if (proc.off) {
      proc.off("uncaughtException", onUncaughtException);
      proc.off("unhandledRejection", onUnhandledRejection);
      return;
    }

    proc.removeListener?.("uncaughtException", onUncaughtException);
    proc.removeListener?.("unhandledRejection", onUnhandledRejection);
  };
}

function captureGlobalError(error: unknown) {
  const normalizedError = error instanceof Error
    ? error
    : new Error(String(error));

  const fingerprint = generateFingerprint(normalizedError);
  const now = Date.now();
  const lastSeen = fingerprintCache.get(fingerprint);

  if (lastSeen && now - lastSeen < DEDUPE_WINDOW) {
    return;
  }

  fingerprintCache.set(fingerprint, now);
  cleanupOldFingerprints(now);

  const event = buildEvent({
    traceId: generateId(),
    name: "GlobalError",
    type: "manual",
    status: "error",
    duration: 0,
    error: normalizedError,
  });

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
