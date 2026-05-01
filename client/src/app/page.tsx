import PageHeader from "@/components/layout/PageHeader";
import OverviewStats from "@/components/overview/OverviewStats";
import TopErrorsPanel from "@/components/overview/TopErrorsPanel";
import ErrorTrendPanel from "@/components/overview/ErrorTrendPanel";
import RecentIssuesPanel from "@/components/overview/RecentIssuesPanel";
import QuickActionsPanel from "@/components/overview/QuickActionsPanel";
import SeverityBreakdownPanel from "@/components/overview/SeverityBreakdownPanel";
import EnvironmentSnapshotPanel from "@/components/overview/EnvironmentSnapshotPanel";
import InvestigationQueuePanel from "@/components/overview/InvestigationQueuePanel";
import EmptyState from "@/components/shared/EmptyState";
import InlineNotice from "@/components/shared/InlineNotice";
import { fetchErrors } from "@/lib/api/errors";
import { fetchErrorTrend, fetchHealth, fetchTopErrors } from "@/lib/api/overview";
import type { OverviewStatsData } from "@/types/overview";

export default async function HomePage() {
  const [healthResult, topErrorsResult, trendResult, allErrorsResult] = await Promise.allSettled([
    fetchHealth(),
    fetchTopErrors(),
    fetchErrorTrend(),
    fetchErrors(1)
  ]);

  const health = healthResult.status === "fulfilled" ? healthResult.value : null;
  const topErrors = topErrorsResult.status === "fulfilled" ? topErrorsResult.value : [];
  const trend = trendResult.status === "fulfilled" ? trendResult.value : [];
  const allErrors = allErrorsResult.status === "fulfilled" ? allErrorsResult.value : [];
  const hadFetchIssue =
    healthResult.status === "rejected" ||
    topErrorsResult.status === "rejected" ||
    trendResult.status === "rejected" ||
    allErrorsResult.status === "rejected";

  const data: OverviewStatsData = {
    health,
    topErrors,
    trend,
    allErrors
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Know what is failing before you open the code."
        description="HackTrace should quickly answer what broke, how widespread it is, and where to start investigating."
      />

      {hadFetchIssue ? (
        <InlineNotice title="Some overview data could not be loaded" tone="warning">
          The dashboard is still rendering with whatever data was available, but one or more backend requests failed.
        </InlineNotice>
      ) : null}

      <OverviewStats data={data} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ErrorTrendPanel trend={trend} />
        <QuickActionsPanel health={health} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {topErrors.length > 0 ? (
          <TopErrorsPanel errors={topErrors} />
        ) : (
          <EmptyState
            title="No grouped errors yet"
            description="Once the SDK starts sending failures, this panel will help you spot the most urgent issues."
          />
        )}

        {allErrors.length > 0 ? (
          <RecentIssuesPanel errors={allErrors} />
        ) : (
          <EmptyState
            title="No recent issues yet"
            description="The dashboard is ready. Next step is wiring the SDK and sending a first trace."
          />
        )}
      </div>

      {allErrors.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <SeverityBreakdownPanel errors={allErrors} />
          <EnvironmentSnapshotPanel errors={allErrors} />
          <InvestigationQueuePanel errors={allErrors} />
        </div>
      ) : null}
    </div>
  );
}
