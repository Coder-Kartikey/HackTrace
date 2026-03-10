export type Runtime = "browser" | "node";

export type Severity = "info" | "warning" | "critical";

export interface HackTraceConfig {
  apiKey: string;
  endpoint: string;

  sampleRate?: number;
  batchSize?: number;
  flushInterval?: number;

  environment?: "development" | "production";

  autoCapture?: boolean;
}

export interface TraceEvent {
  traceId: string;
  parentId?: string;
  sessionId: string;

  name: string;
  type: "span" | "function" | "manual";

  status: "success" | "error";

  severity: Severity;

  timestamp: number;
  duration: number;

  error?: {
    name: string;
    message: string;
    stack?: string;
    fingerprint: string;
  };

  metadata?: Record<string, unknown>;

  tags?: string[];

  environment: {
    runtime: Runtime;
    sdkVersion: string;
    appEnvironment: string;
  };
}
