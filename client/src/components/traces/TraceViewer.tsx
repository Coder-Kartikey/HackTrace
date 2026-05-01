"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TraceTree from "@/components/traces/TraceTree";
import TraceTimeline from "@/components/traces/TraceTimeline";
import SpanDetailsPanel from "@/components/traces/SpanDetailsPanel";
import TraceMetadataPanel from "@/components/traces/TraceMetadataPanel";
import TraceStatsBar from "@/components/traces/TraceStatsBar";
import TraceSpanTable from "@/components/traces/TraceSpanTable";
import Card from "@/components/shared/Card";
import { buildTraceTree } from "@/lib/trace/buildTraceTree";
import { buildTimelineModel } from "@/lib/trace/buildTimelineModel";
import { createSearchParams } from "@/lib/utils/queryParams";
import type { TraceEvent } from "@/types/error";
import type { TraceNode } from "@/types/trace";

function findNode(root: TraceNode | null, traceId?: string): TraceNode | null {
  if (!root || !traceId) {
    return root;
  }

  if (root.traceId === traceId) {
    return root;
  }

  for (const child of root.children) {
    const match = findNode(child, traceId);

    if (match) {
      return match;
    }
  }

  return null;
}

export default function TraceViewer({
  events,
  initialFocus
}: {
  events: TraceEvent[];
  initialFocus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const root = buildTraceTree(events);
  const timeline = buildTimelineModel(root);
  const [query, setQuery] = useState("");
  const [selectedTraceId, setSelectedTraceId] = useState<string | undefined>(
    initialFocus ?? root?.traceId
  );
  const resolvedSelectedTraceId = selectedTraceId ?? initialFocus ?? root?.traceId;
  const selectedNode = findNode(root, resolvedSelectedTraceId);

  function handleSelect(traceId: string) {
    setSelectedTraceId(traceId);

    const params = createSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      focus: traceId
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <TraceStatsBar events={events} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <TraceTree
          root={root}
          selectedTraceId={resolvedSelectedTraceId}
          onSelect={(node) => handleSelect(node.traceId)}
        />
        <TraceTimeline
          items={timeline}
          selectedTraceId={resolvedSelectedTraceId}
          onSelect={handleSelect}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SpanDetailsPanel node={selectedNode} />
        <TraceMetadataPanel node={selectedNode} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
              Span browser
            </p>
            <h2 className="mt-2 text-xl font-semibold">Search and jump through recorded spans</h2>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter spans by name, type, or trace id"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-text-muted)] lg:max-w-md"
          />
        </div>
        <TraceSpanTable
          events={events}
          selectedTraceId={resolvedSelectedTraceId}
          onSelect={handleSelect}
          query={query}
        />
      </Card>
    </div>
  );
}
