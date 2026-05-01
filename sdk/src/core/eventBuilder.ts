import { TraceEvent, Severity } from "../types";
import { getState } from "../state";
import { SDK_VERSION } from "../version";
import { classifyError } from "../intelligence/classify";
import { generateFingerprint } from "../intelligence/fingerprint";

interface BuildEventParams {
  traceId: string;
  parentId?: string;
  rootTraceId?: string;
  name: string;
  type: "span" | "function" | "manual";
  status: "success" | "error";
  metadata?: Record<string, unknown>;
  tags?: string[];
  duration: number;
  error?: Error;
}

export function buildEvent(params: BuildEventParams): TraceEvent {
  const state = getState();

  let severity: Severity = "info";

  let errorData;

  if (params.error) {
    severity = classifyError(params.error);

    errorData = {
      name: params.error.name,
      message: params.error.message,
      stack: params.error.stack,
      fingerprint: generateFingerprint(params.error),
    };
  }

  return {
    traceId: params.traceId,
    parentId: params.parentId,
    rootTraceId: params.rootTraceId || params.traceId,
    sessionId: state.sessionId,
    name: params.name,
    type: params.type,
    status: params.status,
    severity,
    timestamp: Date.now(),
    metadata: params.metadata,
    tags: params.tags,
    duration: params.duration,
    error: errorData,
    environment: {
      runtime: state.runtime,
      sdkVersion: SDK_VERSION,
      appEnvironment: state.config.environment,
    },
  };
}
