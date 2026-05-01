import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import { formatCount } from "@/lib/format/numbers";
import type { ErrorGroup } from "@/types/error";

const severityOrder = ["critical", "warning", "info"] as const;

export default function SeverityBreakdownPanel({
  errors
}: {
  errors: ErrorGroup[];
}) {
  const counts = severityOrder.map((severity) => ({
    severity,
    count: errors.filter((error) => error.severity === severity).length
  }));

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Severity mix
      </p>
      <h2 className="mt-2 text-xl font-semibold">How urgent the current backlog looks</h2>
      <div className="mt-6 space-y-4">
        {counts.map((entry) => (
          <div
            key={entry.severity}
            className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4"
          >
            <div className="flex items-center gap-3">
              <SeverityBadge severity={entry.severity} />
              <span className="text-sm font-medium capitalize">{entry.severity}</span>
            </div>
            <span className="text-lg font-semibold">{formatCount(entry.count)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
