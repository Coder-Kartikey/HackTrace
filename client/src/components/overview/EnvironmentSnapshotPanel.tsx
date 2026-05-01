import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import type { ErrorGroup } from "@/types/error";

export default function EnvironmentSnapshotPanel({
  errors
}: {
  errors: ErrorGroup[];
}) {
  const environments = Array.from(
    new Set(errors.flatMap((error) => error.environments ?? []))
  );

  const affectedFunctions = Array.from(
    new Set(errors.flatMap((error) => error.affectedFunctions ?? []))
  ).slice(0, 8);

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Surface area
      </p>
      <h2 className="mt-2 text-xl font-semibold">Where the current errors are clustered</h2>
      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-semibold">Environments</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {environments.length > 0 ? (
              environments.map((environment) => <Badge key={environment}>{environment}</Badge>)
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No environment data yet.</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Affected functions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {affectedFunctions.length > 0 ? (
              affectedFunctions.map((name) => <Badge key={name}>{name}</Badge>)
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No function names have been grouped yet.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
