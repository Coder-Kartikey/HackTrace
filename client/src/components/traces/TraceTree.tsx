import Card from "@/components/shared/Card";
import TraceNode from "@/components/traces/TraceNode";
import type { TraceNode as TraceNodeType } from "@/types/trace";

export default function TraceTree({
  root,
  selectedTraceId,
  onSelect
}: {
  root: TraceNodeType | null;
  selectedTraceId?: string;
  onSelect: (node: TraceNodeType) => void;
}) {
  return (
    <Card className="h-full">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Trace tree
      </p>
      <h2 className="mt-2 text-xl font-semibold">Parent-child execution flow</h2>
      <div className="mt-6">
        {root ? (
          <TraceNode
            node={root}
            selectedTraceId={selectedTraceId}
            onSelect={onSelect}
          />
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            No trace structure available yet.
          </p>
        )}
      </div>
    </Card>
  );
}
