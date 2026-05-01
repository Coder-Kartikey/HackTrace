import Link from "next/link";
import Card from "@/components/shared/Card";
import type { HealthResponse } from "@/types/api";

export default function QuickActionsPanel({
  health
}: {
  health: HealthResponse | null;
}) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Quick actions
      </p>
      <h2 className="mt-2 text-xl font-semibold">Keep momentum high</h2>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-sm font-semibold">Backend status</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {health?.status === "ok"
              ? "Connected and ready for trace lookups."
              : "The health check failed or has not been configured yet."}
          </p>
        </div>
        <Link
          href="/setup"
          className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 transition hover:border-[var(--color-accent)]/50"
        >
          <p className="text-sm font-semibold">Finish SDK onboarding</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Copy install and init snippets, then send the first trace.
          </p>
        </Link>
        <Link
          href="/errors"
          className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 transition hover:border-[var(--color-accent)]/50"
        >
          <p className="text-sm font-semibold">Open the errors explorer</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Narrow failures by severity, environment, and message text.
          </p>
        </Link>
      </div>
    </Card>
  );
}
