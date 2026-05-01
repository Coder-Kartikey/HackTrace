import { cn } from "@/lib/utils/cn";
import type { TraceNode as TraceNodeType } from "@/types/trace";

export default function TraceNode({
  node,
  selectedTraceId,
  onSelect
}: {
  node: TraceNodeType;
  selectedTraceId?: string;
  onSelect: (node: TraceNodeType) => void;
}) {
  const isSelected = selectedTraceId === node.traceId;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node)}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
          isSelected
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
            : "border-[var(--color-border)] bg-[var(--color-surface-soft)] hover:border-[var(--color-accent)]/40"
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{node.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            {node.type} • {node.status}
          </p>
        </div>
        <span className="text-sm text-[var(--color-text-muted)]">
          {node.duration.toFixed(2)} ms
        </span>
      </button>

      {node.children.length > 0 ? (
        <div className="mt-3 space-y-3 pl-4">
          {node.children.map((child) => (
            <TraceNode
              key={child.traceId}
              node={child}
              selectedTraceId={selectedTraceId}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
