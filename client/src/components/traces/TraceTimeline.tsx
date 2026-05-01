import Card from "@/components/shared/Card";
import type { TraceTimelineItem } from "@/types/trace";

function getBarColor(status: TraceTimelineItem["status"]) {
  return status === "error" ? "var(--color-critical)" : "var(--color-accent)";
}

export default function TraceTimeline({
  items,
  selectedTraceId,
  onSelect
}: {
  items: TraceTimelineItem[];
  selectedTraceId?: string;
  onSelect: (traceId: string) => void;
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Timeline
      </p>
      <h2 className="mt-2 text-xl font-semibold">Duration by span</h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <button
            key={item.traceId}
            type="button"
            onClick={() => onSelect(item.traceId)}
            className="block w-full text-left"
          >
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="truncate font-medium">{item.label}</span>
              <span className="text-[var(--color-text-muted)]">{item.duration.toFixed(2)} ms</span>
            </div>
            <div className="relative h-4 rounded-full bg-[var(--color-surface-soft)]">
              <div
                className="absolute top-0 h-4 rounded-full"
                style={{
                  left: `${item.startPct}%`,
                  width: `${item.widthPct}%`,
                  backgroundColor: getBarColor(item.status),
                  opacity: selectedTraceId === item.traceId ? 1 : 0.75
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
