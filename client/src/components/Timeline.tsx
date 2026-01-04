// import { ChevronRight } from 'lucide-react';
import type { TraceDetail } from '../mockData';

interface TimelineProps {
  trace: TraceDetail;
}

export function Timeline({ trace }: TimelineProps) {
  const stack = trace.trace?.stack ?? [];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg text-white">Stack Trace Timeline</h3>
      {!stack.length ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
          No execution steps available for this trace.
        </div>
      ) : (
        <div className="space-y-3">
          {stack.map((item, index) => {
            const fnName = item.function ?? 'unknown';
            const file = item.file ?? 'unknown';
            const line = Number.isFinite(item.line) ? item.line : '—';
            const column = Number.isFinite(item.column) ? item.column : '—';
            const durationLabel = item.duration ? `${item.duration}ms` : '—';
            const isError = item.type === 'error' || fnName === trace.pattern.errorFn;
            const borderColor = isError ? 'border-red-500' : 'border-blue-500';
            const dotColor = isError ? 'bg-red-500' : 'bg-blue-500';
            const cardBorder = isError ? 'border-red-500/40' : 'border-zinc-800';
            const cardBg = isError ? 'bg-red-500/5' : 'bg-zinc-900';
            const textColor = isError ? 'text-red-300' : 'text-blue-400';

            return (
              <div key={`${fnName}-${index}`} className="relative">
                {index < stack.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-0.5 bg-zinc-800"></div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${borderColor} bg-zinc-900`}>
                    <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
                  </div>
                  <div className={`flex-1 rounded-lg border ${cardBorder} ${cardBg} p-3`}>
                    <div className="flex items-center justify-between">
                      <code className={`text-sm ${textColor}`}>{fnName}()</code>
                      <span className="text-xs text-zinc-500">{durationLabel}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="font-mono">{file}</span>
                      <span>·</span>
                      <span>
                        Line {line}:{column}
                      </span>
                    </div>
                    {isError && item.errorMessage && (
                      <div className="mt-2 rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300">
                        {item.errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}