import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import { formatDateTime } from "@/lib/format/dates";
import { formatDuration } from "@/lib/format/duration";
import type { TraceNode } from "@/types/trace";

export default function SpanDetailsPanel({
  node
}: {
  node: TraceNode | null;
}) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Span details
      </p>
      {node ? (
        <div className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{node.name}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {node.traceId}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{node.type}</Badge>
            <Badge>{node.status}</Badge>
            <Badge>{node.environment.runtime}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Timestamp
              </p>
              <p className="mt-2 text-sm">{formatDateTime(node.timestamp)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Duration
              </p>
              <p className="mt-2 text-sm">{formatDuration(node.duration)}</p>
            </div>
          </div>
          {node.error ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Error
              </p>
              <p className="mt-2 text-sm">
                {node.error.name}: {node.error.message}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Select a span to inspect its metadata and error details.
        </p>
      )}
    </Card>
  );
}
