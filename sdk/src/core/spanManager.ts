import { generateId } from "./id";
import { buildEvent } from "./eventBuilder";
import { processEvent } from "../transport/batcher";
import { pushSpan, popSpan, getCurrentSpan, getRootSpan } from "../context";

interface ActiveSpan {
  id: string;
  name: string;
  start: number;
  parentId?: string;
  rootTraceId: string;
}

const activeSpans = new Map<string, ActiveSpan>();
const activeSpanOrder: string[] = [];

export function startSpan(name: string): string {
  const id = generateId();
  const parentId = getCurrentSpan();

  pushSpan(id);
  const rootTraceId = getRootSpan() || id;

  activeSpans.set(id, {
    id,
    name,
    start: performance.now(),
    parentId,
    rootTraceId,
  });
  activeSpanOrder.push(id);

  return id;
}

export function endSpan(id?: string) {
  const targetId = id ?? activeSpanOrder[activeSpanOrder.length - 1];
  if (!targetId) return;

  const currentActiveId = activeSpanOrder[activeSpanOrder.length - 1];
  if (currentActiveId !== targetId) {
    throw new Error(`HackTrace: Cannot end span "${targetId}" while "${currentActiveId}" is active.`);
  }

  const span = activeSpans.get(targetId);
  if (!span) return;

  const duration = performance.now() - span.start;

  const event = buildEvent({
    traceId: span.id,
    parentId: span.parentId,
    rootTraceId: span.rootTraceId,
    name: span.name,
    type: "span",
    status: "success",
    duration,
  });

  processEvent(event);

  activeSpans.delete(targetId);
  activeSpanOrder.pop();
  popSpan();
}
