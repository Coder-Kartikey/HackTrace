import { generateId } from "./id";
import { buildEvent } from "./eventBuilder";
import { processEvent } from "../transport/batcher";

const spanStack: string[] = [];

export function pushSpan(spanId: string) {
  spanStack.push(spanId);
}

export function popSpan() {
  spanStack.pop();
}

export function getCurrentSpan(): string | undefined {
  return spanStack[spanStack.length - 1];
}


interface ActiveSpan {
  id: string;
  name: string;
  start: number;
  parentId?: string;
}

const activeSpans: ActiveSpan[] = [];

export function startSpan(name: string): string {
  const id = generateId();
  const parentId = getCurrentSpan();

  pushSpan(id);

  activeSpans.push({
    id,
    name,
    start: performance.now(),
    parentId,
  });

  return id;
}

export function endSpan(id?: string) {
  const span = activeSpans.pop();
  if (!span) return;

  const duration = performance.now() - span.start;

  const event = buildEvent({
    traceId: span.id,
    parentId: span.parentId,
    name: span.name,
    type: "span",
    status: "success",
    duration,
  });

  processEvent(event);

  popSpan();
}
