import Link from "next/link";
import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import { formatDateTime } from "@/lib/format/dates";
import type { ErrorGroup } from "@/types/error";

export default function RecentIssuesPanel({ errors }: { errors: ErrorGroup[] }) {
  const sorted = errors
    .slice()
    .sort(
      (left, right) =>
        new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Recent
      </p>
      <h2 className="mt-2 text-xl font-semibold">Fresh signals worth checking</h2>
      <div className="mt-6 space-y-4">
        {sorted.map((error) => (
          <Link
            key={error.fingerprint}
            href={`/errors/${error.fingerprint}`}
            className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 transition hover:border-[var(--color-accent)]/50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{error.errorName}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{error.message}</p>
              </div>
              <SeverityBadge severity={error.severity} />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Last seen {formatDateTime(error.lastSeen)}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
