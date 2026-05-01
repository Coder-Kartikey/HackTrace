import Link from "next/link";
import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import { formatCount } from "@/lib/format/numbers";
import type { ErrorGroup } from "@/types/error";

export default function TopErrorsPanel({ errors }: { errors: ErrorGroup[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Top errors
          </p>
          <h2 className="mt-2 text-xl font-semibold">What is hurting the most right now</h2>
        </div>
        <Link href="/errors" className="text-sm text-[var(--color-accent)]">
          View all
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {errors.map((error) => (
          <Link
            key={error.fingerprint}
            href={`/errors/${error.fingerprint}`}
            className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 transition hover:border-[var(--color-accent)]/50"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="truncate text-sm font-semibold">{error.errorName}</h3>
                <SeverityBadge severity={error.severity} />
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{error.message}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-semibold">{formatCount(error.occurrences)}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                hits
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
