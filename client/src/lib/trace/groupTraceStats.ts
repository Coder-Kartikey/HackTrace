import type { TraceEvent } from "@/types/error";

export function groupTraceStats(events: TraceEvent[]) {
  const totalSpans = events.length;
  const errorCount = events.filter((event) => event.status === "error").length;
  const totalDuration = events.reduce((sum, event) => sum + event.duration, 0);
  const runtimes = Array.from(
    new Set(events.map((event) => event.environment?.runtime).filter(Boolean))
  );

  return {
    totalSpans,
    errorCount,
    totalDuration,
    runtimes
  };
}
