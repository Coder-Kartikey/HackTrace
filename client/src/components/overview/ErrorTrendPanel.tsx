"use client";

import dynamic from "next/dynamic";
import Card from "@/components/shared/Card";
import { formatRelativeDayLabel } from "@/lib/format/dates";
import type { ErrorTrendPoint } from "@/types/overview";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ErrorTrendChart({
  chartData
}: {
  chartData: Array<ErrorTrendPoint & { label: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="label" stroke="#8da3c3" />
        <YAxis stroke="#8da3c3" />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(173, 198, 255, 0.12)",
            backgroundColor: "#13263f",
            color: "#eef4ff"
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6ee7c8"
          strokeWidth={3}
          dot={{ fill: "#6ee7c8", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const ClientOnlyErrorTrendChart = dynamic(
  () => Promise.resolve(ErrorTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full animate-pulse rounded-3xl bg-[var(--color-surface-soft)]" />
    )
  }
);

export default function ErrorTrendPanel({
  trend
}: {
  trend: ErrorTrendPoint[];
}) {
  const chartData = trend.map((item) => ({
    ...item,
    label: formatRelativeDayLabel(item._id)
  }));

  return (
    <Card className="min-h-[360px]">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Trend
      </p>
      <h2 className="mt-2 text-xl font-semibold">Daily error volume</h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        Use this to spot regressions, noisy rollouts, or improvements after a fix lands.
      </p>

      <div className="mt-8 h-[250px]">
        <ClientOnlyErrorTrendChart chartData={chartData} />
      </div>
    </Card>
  );
}
