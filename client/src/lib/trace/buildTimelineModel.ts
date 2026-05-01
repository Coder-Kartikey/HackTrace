import type { TraceNode, TraceTimelineItem } from "@/types/trace";

export function buildTimelineModel(root: TraceNode | null): TraceTimelineItem[] {
  if (!root) {
    return [];
  }

  const total = Math.max(root.duration, 1);
  const items: TraceTimelineItem[] = [];

  function visit(node: TraceNode) {
    items.push({
      traceId: node.traceId,
      label: node.name,
      depth: node.depth,
      startPct: (node.startMs / total) * 100,
      widthPct: Math.max((node.duration / total) * 100, 3),
      duration: node.duration,
      status: node.status,
      type: node.type
    });

    node.children.forEach(visit);
  }

  visit(root);
  return items;
}
