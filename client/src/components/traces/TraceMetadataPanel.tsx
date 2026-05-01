import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import type { TraceNode } from "@/types/trace";

function renderMetadata(value: unknown) {
  if (value == null) {
    return "N/A";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

export default function TraceMetadataPanel({
  node
}: {
  node: TraceNode | null;
}) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Metadata
      </p>
      <h2 className="mt-2 text-xl font-semibold">Context attached to the selected span</h2>

      {node ? (
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-semibold">Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(node.tags ?? []).length > 0 ? (
                node.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">No tags attached.</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Environment</p>
            <pre className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-sm">
              {renderMetadata(node.environment)}
            </pre>
          </div>
          <div>
            <p className="text-sm font-semibold">Metadata object</p>
            <pre className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 text-sm">
              {renderMetadata(node.metadata)}
            </pre>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Select a span to inspect its metadata.
        </p>
      )}
    </Card>
  );
}
