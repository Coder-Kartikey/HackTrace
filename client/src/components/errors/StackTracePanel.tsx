import Card from "@/components/shared/Card";
import { normalizeStack } from "@/lib/format/stack";

export default function StackTracePanel({ stack }: { stack?: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Stack trace
      </p>
      <h2 className="mt-2 text-xl font-semibold">Latest captured failure stack</h2>
      <pre className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-foreground)]">
        {normalizeStack(stack)}
      </pre>
    </Card>
  );
}
