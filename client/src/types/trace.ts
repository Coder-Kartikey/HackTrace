import type { TraceEvent } from "@/types/error";

export interface TraceNode extends TraceEvent {
  children: TraceNode[];
  depth: number;
  startMs: number;
  endMs: number;
}

export interface TraceTimelineItem {
  traceId: string;
  label: string;
  depth: number;
  startPct: number;
  widthPct: number;
  duration: number;
  status: TraceNode["status"];
  type: TraceNode["type"];
}

export interface TraceViewerState {
  selectedTraceId?: string;
}
