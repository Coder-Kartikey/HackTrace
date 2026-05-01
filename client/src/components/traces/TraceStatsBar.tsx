import StatCard from "@/components/shared/StatCard";
import { formatCount } from "@/lib/format/numbers";
import { formatDuration } from "@/lib/format/duration";
import { groupTraceStats } from "@/lib/trace/groupTraceStats";
import type { TraceEvent } from "@/types/error";

export default function TraceStatsBar({
  events
}: {
  events: TraceEvent[];
}) {
  const stats = groupTraceStats(events);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Spans" value={formatCount(stats.totalSpans)} />
      <StatCard label="Errors" value={formatCount(stats.errorCount)} />
      <StatCard
        label="Runtime mix"
        value={stats.runtimes.join(", ") || "Unknown"}
      />
      <StatCard
        label="Total duration"
        value={formatDuration(stats.totalDuration)}
      />
    </div>
  );
}
