export { init } from "./core/init";
export { trace } from "./core/tracer";
export { startSpan, endSpan } from "./core/spanManager";
export { flush, shutdown } from "./transport/batcher";

export type {
  HackTraceConfig,
  TraceEvent,
  Severity,
  Runtime,
} from "./types";
