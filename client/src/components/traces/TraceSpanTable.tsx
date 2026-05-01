import { formatDateTime } from "@/lib/format/dates";
import { formatDuration } from "@/lib/format/duration";
import { cn } from "@/lib/utils/cn";
import type { TraceEvent } from "@/types/error";

export default function TraceSpanTable({
  events,
  selectedTraceId,
  onSelect,
  query
}: {
  events: TraceEvent[];
  selectedTraceId?: string;
  onSelect: (traceId: string) => void;
  query: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = events.filter((event) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      event.name.toLowerCase().includes(normalizedQuery) ||
      event.traceId.toLowerCase().includes(normalizedQuery) ||
      event.type.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]">
          <tr>
            <th className="px-5 py-4 font-medium">Span</th>
            <th className="px-5 py-4 font-medium">Type</th>
            <th className="px-5 py-4 font-medium">Started</th>
            <th className="px-5 py-4 font-medium">Duration</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((event) => (
            <tr
              key={event.traceId}
              className={cn(
                "cursor-pointer border-t border-[var(--color-border)] transition hover:bg-[var(--color-surface-soft)]/60",
                selectedTraceId === event.traceId ? "bg-[var(--color-accent)]/10" : ""
              )}
              onClick={() => onSelect(event.traceId)}
            >
              <td className="px-5 py-4">
                <p className="font-semibold">{event.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  {event.traceId}
                </p>
              </td>
              <td className="px-5 py-4 text-[var(--color-text-muted)]">{event.type}</td>
              <td className="px-5 py-4 text-[var(--color-text-muted)]">
                {formatDateTime(event.timestamp)}
              </td>
              <td className="px-5 py-4 text-[var(--color-text-muted)]">
                {formatDuration(event.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
