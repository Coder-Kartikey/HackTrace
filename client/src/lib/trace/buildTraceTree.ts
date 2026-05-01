import type { TraceEvent } from "@/types/error";
import type { TraceNode } from "@/types/trace";

function toTimestamp(value: string | number) {
  return new Date(value).getTime();
}

export function buildTraceTree(events: TraceEvent[]): TraceNode | null {
  if (events.length === 0) {
    return null;
  }

  const sorted = [...events].sort(
    (left, right) => toTimestamp(left.timestamp) - toTimestamp(right.timestamp)
  );

  const firstTimestamp = toTimestamp(sorted[0].timestamp);

  const nodeMap = new Map<string, TraceNode>();
  const roots: TraceNode[] = [];

  for (const event of sorted) {
    const startMs = toTimestamp(event.timestamp) - firstTimestamp;
    nodeMap.set(event.traceId, {
      ...event,
      children: [],
      depth: 0,
      startMs,
      endMs: startMs + event.duration
    });
  }

  for (const event of sorted) {
    const currentNode = nodeMap.get(event.traceId);

    if (!currentNode) {
      continue;
    }

    if (event.parentId && nodeMap.has(event.parentId)) {
      const parentNode = nodeMap.get(event.parentId);

      if (parentNode) {
        currentNode.depth = parentNode.depth + 1;
        parentNode.children.push(currentNode);
        continue;
      }
    }

    roots.push(currentNode);
  }

  return roots[0] ?? null;
}
