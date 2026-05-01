"use client";

import dynamic from "next/dynamic";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "@/components/shared/Card";
import { formatRelativeDayLabel } from "@/lib/format/dates";
import type { TraceEvent } from "@/types/error";

function OccurrenceChart({
  grouped
}: {
  grouped: Array<{ date: string; count: number; label: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={grouped}>
        <XAxis dataKey="label" stroke="#8da3c3" />
        <YAxis stroke="#8da3c3" allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(173, 198, 255, 0.12)",
            backgroundColor: "#13263f",
            color: "#eef4ff"
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#ffcb6b"
          fill="rgba(255, 203, 107, 0.22)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const ClientOnlyOccurrenceChart = dynamic(
  () => Promise.resolve(OccurrenceChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full animate-pulse rounded-3xl bg-[var(--color-surface-soft)]" />
    )
  }
);

export default function ErrorOccurrenceChart({
  events
}: {
  events: TraceEvent[];
}) {
  const grouped = Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      const key = new Date(event.timestamp).toISOString().slice(0, 10);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({
    date,
    count,
    label: formatRelativeDayLabel(date)
  }));

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Recent pattern
      </p>
      <h2 className="mt-2 text-xl font-semibold">Sample of recent captured occurrences</h2>
      <div className="mt-6 h-[220px]">
        <ClientOnlyOccurrenceChart grouped={grouped} />
      </div>
    </Card>
  );
}
