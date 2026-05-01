import { generateId } from "./id";
import { pushSpan, popSpan, getCurrentSpan, getRootSpan, runWithContext } from "../context";
import { buildEvent } from "./eventBuilder";
import { processEvent } from "../transport/batcher";
import { shouldSample } from "./sampling";
import { isActive } from "../state";

export async function trace<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: {
    metadata?: Record<string, unknown>;
    tags?: string[];
  }
): Promise<T> {
  if (!isActive()) {
    return await fn();
  }

  if (!shouldSample()) {
    return await fn();
  }

  const parentId = getCurrentSpan();

  if (!parentId) {
    return runWithContext(() => executeTrace(name, fn, options), []);
  }

  return executeTrace(name, fn, options);
}

async function executeTrace<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: {
    metadata?: Record<string, unknown>;
    tags?: string[];
  }
): Promise<T> {

  const traceId = generateId();
  const parentId = getCurrentSpan();
  const rootTraceId = getRootSpan() || traceId;

  pushSpan(traceId);

  const start = performance.now();

  try {
    const result = await fn();

    const duration = performance.now() - start;

    const event = buildEvent({
      traceId,
      parentId,
      rootTraceId,
      name,
      type: "function",
      status: "success",
      duration,
      metadata: options?.metadata,
      tags: options?.tags,
    });

    processEvent(event);

    return result;
  } catch (error) {
    const duration = performance.now() - start;

    const event = buildEvent({
      traceId,
      parentId,
      rootTraceId,
      name,
      type: "function",
      status: "error",
      duration,
      error: error as Error,
      metadata: options?.metadata,
      tags: options?.tags,
    });
    processEvent(event);
    throw error;
  } finally {
    popSpan();
  }
}
