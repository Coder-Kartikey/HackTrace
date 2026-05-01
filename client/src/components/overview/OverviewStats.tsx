import StatCard from "@/components/shared/StatCard";
import { formatCount } from "@/lib/format/numbers";
import type { OverviewStatsData } from "@/types/overview";

export default function OverviewStats({ data }: { data: OverviewStatsData }) {
  const totalGroups = data.allErrors.length;
  const criticalGroups = data.allErrors.filter((error) => error.severity === "critical").length;
  const totalOccurrences = data.allErrors.reduce(
    (sum, error) => sum + error.occurrences,
    0
  );
  const latestIssue = data.allErrors
    .slice()
    .sort(
      (left, right) =>
        new Date(right.lastSeen).getTime() - new Date(left.lastSeen).getTime()
    )[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Backend health"
        value={data.health?.status === "ok" ? "Connected" : "Unknown"}
        hint="Checks whether the dashboard can still reach the ingestion backend."
      />
      <StatCard
        label="Error groups"
        value={formatCount(totalGroups)}
        hint="Distinct grouped failures currently visible for this API key."
      />
      <StatCard
        label="Critical groups"
        value={formatCount(criticalGroups)}
        hint="Issues already marked critical by the SDK and backend pipeline."
      />
      <StatCard
        label="Total occurrences"
        value={formatCount(totalOccurrences)}
        hint={
          latestIssue
            ? `Latest issue: ${latestIssue.errorName}`
            : "Counts all grouped occurrences returned by the backend."
        }
      />
    </div>
  );
}
