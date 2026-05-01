import Link from "next/link";
import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import { formatDateTime } from "@/lib/format/dates";
import { formatDuration } from "@/lib/format/duration";
import type { TraceEvent } from "@/types/error";

export default function ErrorRecentEvents({ events }: { events: TraceEvent[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Recent events
          </p>
          <h2 className="mt-2 text-xl font-semibold">Latest failing executions</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div
            key={event._id ?? event.traceId}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{event.name}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {formatDateTime(event.timestamp)}
                </p>
              </div>
              <SeverityBadge severity={event.severity} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
              <span>Duration: {formatDuration(event.duration)}</span>
              <span>Status: {event.status}</span>
              <span>Runtime: {event.environment.runtime}</span>
            </div>
            <Link
              href={`/traces/${event.traceId}`}
              className="mt-4 inline-flex text-sm font-medium text-[var(--color-accent)]"
            >
              Inspect trace
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
