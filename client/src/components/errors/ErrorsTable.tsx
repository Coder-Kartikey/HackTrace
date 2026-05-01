import Link from "next/link";
import Card from "@/components/shared/Card";
import SeverityBadge from "@/components/errors/SeverityBadge";
import Badge from "@/components/shared/Badge";
import { formatDateTime } from "@/lib/format/dates";
import { formatCount } from "@/lib/format/numbers";
import { isWithinRange } from "@/lib/utils/filters";
import { createSearchParams } from "@/lib/utils/queryParams";
import type { ErrorFiltersState } from "@/lib/api/errors";
import type { ErrorGroup } from "@/types/error";

function applyFilters(errors: ErrorGroup[], filters: ErrorFiltersState) {
  return errors
    .filter((error) => {
      const query = filters.q.trim().toLowerCase();
      if (!query) {
        return true;
      }

      return (
        error.errorName.toLowerCase().includes(query) ||
        error.message.toLowerCase().includes(query) ||
        error.fingerprint.toLowerCase().includes(query)
      );
    })
    .filter((error) => {
      if (filters.severity === "all") {
        return true;
      }

      return error.severity === filters.severity;
    })
    .filter((error) => {
      if (filters.environment === "all") {
        return true;
      }

      return error.environments?.includes(filters.environment) ?? false;
    })
    .filter((error) => isWithinRange(error.lastSeen, filters.range))
    .sort((left, right) => {
      if (filters.sort === "occurrences") {
        return right.occurrences - left.occurrences;
      }

      if (filters.sort === "severity") {
        const order = { critical: 3, warning: 2, info: 1 };
        return order[right.severity] - order[left.severity];
      }

      return new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime();
    });
}

export default function ErrorsTable({
  errors,
  filters
}: {
  errors: ErrorGroup[];
  filters: ErrorFiltersState;
}) {
  const filtered = applyFilters(errors, filters);
  const activeChips = [
    filters.q ? `Search: ${filters.q}` : null,
    filters.severity !== "all" ? `Severity: ${filters.severity}` : null,
    filters.environment !== "all" ? `Environment: ${filters.environment}` : null,
    `Range: ${filters.range}`,
    `Sort: ${filters.sort}`
  ].filter(Boolean) as string[];
  const prevHref =
    filters.page > 1
      ? `/errors?${createSearchParams({
          ...filters,
          page: filters.page - 1
        }).toString()}`
      : null;
  const nextHref = `/errors?${createSearchParams({
    ...filters,
    page: filters.page + 1
  }).toString()}`;
  const clearHref = "/errors";

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-foreground)]">
              Showing {formatCount(filtered.length)} grouped issues on page {filters.page}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Filters are stored in the URL so investigation views stay shareable and refresh-safe.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {prevHref ? (
              <Link
                href={prevHref}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-soft)]"
              >
                Previous
              </Link>
            ) : null}
            <Link
              href={nextHref}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-soft)]"
            >
              Next
            </Link>
            <Link
              href={clearHref}
              className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)]"
            >
              Clear filters
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <Badge key={chip}>{chip}</Badge>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]">
            <tr>
              <th className="px-5 py-4 font-medium">Issue</th>
              <th className="px-5 py-4 font-medium">Occurrences</th>
              <th className="px-5 py-4 font-medium">Last seen</th>
              <th className="px-5 py-4 font-medium">Severity</th>
              <th className="px-5 py-4 font-medium">Environments</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((error) => (
              <tr
                key={error.fingerprint}
                className="border-t border-[var(--color-border)] align-top transition hover:bg-[var(--color-surface-soft)]/60"
              >
                <td className="px-5 py-4">
                  <Link href={`/errors/${error.fingerprint}`} className="block">
                    <p className="font-semibold">{error.errorName}</p>
                    <p className="mt-1 text-[var(--color-text-muted)]">{error.message}</p>
                    {(error.affectedFunctions ?? []).length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {error.affectedFunctions?.slice(0, 3).map((name) => (
                          <Badge key={name}>{name}</Badge>
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      {error.fingerprint}
                    </p>
                  </Link>
                </td>
                <td className="px-5 py-4 font-semibold">{formatCount(error.occurrences)}</td>
                <td className="px-5 py-4 text-[var(--color-text-muted)]">
                  {formatDateTime(error.lastSeen)}
                </td>
                <td className="px-5 py-4">
                  <SeverityBadge severity={error.severity} />
                </td>
                <td className="px-5 py-4 text-[var(--color-text-muted)]">
                  {(error.environments ?? []).join(", ") || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
