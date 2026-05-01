import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ErrorSummaryHeader from "@/components/errors/ErrorSummaryHeader";
import StackTracePanel from "@/components/errors/StackTracePanel";
import ErrorEnvironmentPanel from "@/components/errors/ErrorEnvironmentPanel";
import ErrorRecentEvents from "@/components/errors/ErrorRecentEvents";
import ErrorOccurrenceChart from "@/components/errors/ErrorOccurrenceChart";
import AffectedFunctionsPanel from "@/components/errors/AffectedFunctionsPanel";
import TraceViewer from "@/components/traces/TraceViewer";
import Card from "@/components/shared/Card";
import ErrorState from "@/components/shared/ErrorState";
import { fetchErrorDetails } from "@/lib/api/errors";
import { isApiRequestError } from "@/lib/api/client";
import { fetchTrace } from "@/lib/api/traces";

export default async function ErrorDetailPage({
  params
}: {
  params: Promise<{ fingerprint: string }>;
}) {
  const { fingerprint } = await params;
  const detailResult = await fetchErrorDetails(fingerprint)
    .then((value) => ({ ok: true as const, value }))
    .catch((error) => ({ ok: false as const, error }));

  if (!detailResult.ok && isApiRequestError(detailResult.error) && detailResult.error.status === 404) {
    notFound();
  }

  if (!detailResult.ok) {
    return (
      <ErrorState
        title="This error group could not be loaded"
        message="The backend request failed before the investigation view could be assembled."
      />
    );
  }

  const data = detailResult.value;

  const latestTraceId = data.recentEvents[0]?.traceId;
  const traceEvents = latestTraceId ? await fetchTrace(latestTraceId).catch(() => []) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Error detail"
        title={data.group.errorName}
        description={data.group.message}
        actions={
          latestTraceId ? (
            <Link
              href={`/traces/${latestTraceId}`}
              className="inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)]"
            >
              Open latest trace
            </Link>
          ) : null
        }
      />

      <ErrorSummaryHeader group={data.group} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <StackTracePanel stack={data.recentEvents[0]?.error?.stack} />
        <ErrorEnvironmentPanel events={data.recentEvents} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ErrorOccurrenceChart events={data.recentEvents} />
        <AffectedFunctionsPanel group={data.group} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ErrorRecentEvents events={data.recentEvents} />
        {traceEvents.length > 0 ? (
          <TraceViewer events={traceEvents} />
        ) : (
          <Card className="flex min-h-[420px] items-center justify-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              A related trace will appear here once one is available for this error group.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
