export { init, shutdown } from "./core/init";
export { trace } from "./core/tracer";
export { startSpan, endSpan } from "./core/spanManager";
export { flush } from "./transport/batcher";
export { bindContext } from "./context";

export type {
  HackTraceConfig,
  TraceEvent,
  Severity,
  Runtime,
} from "./types";
