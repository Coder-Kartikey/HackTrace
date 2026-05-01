import SeverityBadge from "@/components/errors/SeverityBadge";
import Card from "@/components/shared/Card";
import { formatDateTime } from "@/lib/format/dates";
import { formatCount } from "@/lib/format/numbers";
import type { ErrorGroup } from "@/types/error";

export default function ErrorSummaryHeader({ group }: { group: ErrorGroup }) {
  return (
    <Card>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_repeat(3,0.7fr)]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{group.errorName}</h2>
            <SeverityBadge severity={group.severity} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            {group.message}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Occurrences
          </p>
          <p className="mt-3 text-2xl font-semibold">{formatCount(group.occurrences)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            First seen
          </p>
          <p className="mt-3 text-sm text-[var(--color-foreground)]">
            {formatDateTime(group.firstSeen)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Last seen
          </p>
          <p className="mt-3 text-sm text-[var(--color-foreground)]">
            {formatDateTime(group.lastSeen)}
          </p>
        </div>
      </div>
    </Card>
  );
}
