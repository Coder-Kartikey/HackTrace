import { HackTraceConfig } from "../types";
import { detectRuntime } from "../runtime/detectRuntime";
import { initializeState } from "../state";
import { startBatcher } from "../transport/batcher";
import { setupAutoCapture } from "./autoCapture";


export function init(config: HackTraceConfig): void {
  if (!config.apiKey || !config.endpoint) {
    throw new Error("HackTrace: apiKey and endpoint are required.");
  }
  
  if (!config.endpoint.startsWith("http")) {
    throw new Error("HackTrace: endpoint must be valid URL.");
  }

  const runtime = detectRuntime();

  initializeState(config, runtime);

  startBatcher();
  setupAutoCapture();
}