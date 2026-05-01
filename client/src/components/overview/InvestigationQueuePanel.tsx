import Link from "next/link";
import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import { formatDateTime } from "@/lib/format/dates";
import type { ErrorGroup } from "@/types/error";

export default function InvestigationQueuePanel({
  errors
}: {
  errors: ErrorGroup[];
}) {
  const prioritized = errors
    .slice()
    .sort((left, right) => {
      const severityOrder = { critical: 3, warning: 2, info: 1 };
      const severityScore = severityOrder[right.severity] - severityOrder[left.severity];

      if (severityScore !== 0) {
        return severityScore;
      }

      return new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime();
    })
    .slice(0, 4);

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Queue
      </p>
      <h2 className="mt-2 text-xl font-semibold">What to investigate next</h2>
      <div className="mt-6 space-y-4">
        {prioritized.map((error) => (
          <Link
            key={error.fingerprint}
            href={`/errors/${error.fingerprint}`}
            className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 transition hover:border-[var(--color-accent)]/50"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{error.errorName}</p>
              <SeverityBadge severity={error.severity} />
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{error.message}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Last seen {formatDateTime(error.lastSeen)}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
