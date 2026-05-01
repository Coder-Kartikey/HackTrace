import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import type { ErrorGroup } from "@/types/error";

export default function AffectedFunctionsPanel({
  group
}: {
  group: ErrorGroup;
}) {
  const functions = group.affectedFunctions ?? [];

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Impact
      </p>
      <h2 className="mt-2 text-xl font-semibold">Functions touched by this issue</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {functions.length > 0 ? (
          functions.map((fn) => <Badge key={fn}>{fn}</Badge>)
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            The backend has not grouped affected function names for this issue yet.
          </p>
        )}
      </div>
    </Card>
  );
}
