import Card from "@/components/shared/Card";

export default function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? (
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </Card>
  );
}
