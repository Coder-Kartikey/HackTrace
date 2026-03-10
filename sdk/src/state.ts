import { HackTraceConfig, Runtime } from "./types";

interface InternalState {
  config: Required<HackTraceConfig>;
  sessionId: string;
  runtime: Runtime;
  initialized: boolean;
}

const defaultConfig: Required<HackTraceConfig> = {
  apiKey: "",
  endpoint: "",
  sampleRate: 1,
  batchSize: 20,
  flushInterval: 5000,
  environment: "development",
  autoCapture: true,
};

let state: InternalState | null = null;

export function initializeState(
  config: HackTraceConfig,
  runtime: Runtime
) {
  if (state?.initialized) {
    return state;
  }

  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  state = {
    config: mergedConfig,
    runtime,
    sessionId: generateSessionId(),
    initialized: true,
  };

  return state;
}

export function getState() {
  if (!state || !state.initialized) {
    throw new Error("HackTrace not initialized. Call HackTrace.init() first.");
  }
  return state;
}

function generateSessionId(): string {
  return `ht_${Math.random().toString(36).substring(2)}_${Date.now()}`;
}
