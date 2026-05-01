import { HackTraceConfig } from "../types";
import { detectRuntime } from "../runtime/detectRuntime";
import { initializeState, isActive, markShutdown } from "../state";
import { startBatcher, shutdownTransport } from "../transport/batcher";
import { setupAutoCapture, teardownAutoCapture } from "./autoCapture";


export function init(config: HackTraceConfig): void {
  if (!config.apiKey || !config.endpoint) {
    throw new Error("HackTrace: apiKey and endpoint are required.");
  }
  
  if (!config.endpoint.startsWith("http")) {
    throw new Error("HackTrace: endpoint must be valid URL.");
  }

  if (config.sampleRate !== undefined && (config.sampleRate < 0 || config.sampleRate > 1)) {
    throw new Error("HackTrace: sampleRate must be between 0 and 1.");
  }

  if (config.batchSize !== undefined && config.batchSize <= 0) {
    throw new Error("HackTrace: batchSize must be greater than 0.");
  }

  if (config.flushInterval !== undefined && config.flushInterval <= 0) {
    throw new Error("HackTrace: flushInterval must be greater than 0.");
  }

  if (isActive()) {
    return;
  }

  const runtime = detectRuntime();

  initializeState(config, runtime);

  startBatcher();
  setupAutoCapture();
}

export async function shutdown(): Promise<void> {
  teardownAutoCapture();
  await shutdownTransport();
  markShutdown();
}
