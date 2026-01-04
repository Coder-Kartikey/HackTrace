// import { ChevronRight } from 'lucide-react';
import type { TraceDetail } from '../mockData';

interface TimelineProps {
  trace: TraceDetail;
}

export function Timeline({ trace }: TimelineProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg text-white">Stack Trace Timeline</h3>
      <div className="space-y-3">
        {trace.trace.stack.map((item, index) => (
          <div key={index} className="relative">
            {index < trace.trace.stack.length - 1 && (
              <div className="absolute left-[15px] top-8 h-full w-0.5 bg-zinc-800"></div>
            )}
            <div className="flex items-start gap-4">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-zinc-900">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-blue-400">{item.function}()</code>
                  <span className="text-xs text-zinc-500">{item.duration}ms</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-mono">{item.file}</span>
                  <span>·</span>
                  <span>
                    Line {item.line}:{item.column}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-zinc-900">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <div className="text-xs text-red-400">ERROR</div>
            <div className="mt-1 text-sm text-zinc-300">{trace.trace.errorMessage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}