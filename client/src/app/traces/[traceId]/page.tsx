import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import TraceViewer from "@/components/traces/TraceViewer";
import ErrorState from "@/components/shared/ErrorState";
import { formatDuration } from "@/lib/format/duration";
import { groupTraceStats } from "@/lib/trace/groupTraceStats";
import { fetchTrace } from "@/lib/api/traces";
import { isApiRequestError } from "@/lib/api/client";

export default async function TracePage({
  params,
  searchParams
}: {
  params: Promise<{ traceId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { traceId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const focus = typeof resolvedSearchParams?.focus === "string" ? resolvedSearchParams.focus : undefined;
  const traceResult = await fetchTrace(traceId)
    .then((value) => ({ ok: true as const, value }))
    .catch((error) => ({ ok: false as const, error }));

  if (!traceResult.ok && isApiRequestError(traceResult.error) && traceResult.error.status === 404) {
    notFound();
  }

  if (!traceResult.ok) {
    return (
      <ErrorState
        title="This trace could not be loaded"
        message="The backend request failed before the trace viewer could be assembled."
      />
    );
  }

  const events = traceResult.value;

  if (events.length === 0) {
    notFound();
  }

  const stats = groupTraceStats(events);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trace"
        title={events[0]?.rootTraceId || traceId}
        description={`Inspect parent-child execution, timings, span metadata, and the exact shape of this flow. Total recorded duration: ${formatDuration(stats.totalDuration)}.`}
      />
      <TraceViewer events={events} initialFocus={focus} />
    </div>
  );
}
