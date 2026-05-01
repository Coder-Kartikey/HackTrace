import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import type { HealthResponse } from "@/types/api";

export default function ConnectionStatus({
  health,
  apiUrl
}: {
  health: HealthResponse | null;
  apiUrl: string;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Connection
          </p>
          <h2 className="mt-2 text-xl font-semibold">Backend readiness</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            The setup experience is best when the frontend can confirm the backend before you start tracing.
          </p>
        </div>
        <Badge
          className={
            health?.status === "ok"
              ? "border-[var(--color-success)]/35 bg-[var(--color-success)]/15 text-[var(--color-success)]"
              : "border-[var(--color-warning)]/35 bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
          }
        >
          {health?.status === "ok" ? "Connected" : "Unavailable"}
        </Badge>
      </div>
      <p className="mt-5 text-sm text-[var(--color-text-muted)]">
        Current target: <span className="text-[var(--color-foreground)]">{apiUrl}</span>
      </p>
    </Card>
  );
}
