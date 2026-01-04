import { ChevronRight, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TraceListItem as TraceListItemType } from '../mockData';
import { PatternBadge } from './PatternBadge';

interface TraceListItemProps {
  trace: TraceListItemType;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TraceListItem({ trace }: TraceListItemProps) {
  return (
    <Link
      to={`/trace/${trace._id}`}
      className="group block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <PatternBadge type={trace.pattern.type} />
            <span className="text-xs text-zinc-500">in</span>
            <code className="rounded bg-zinc-800/50 px-2 py-0.5 text-sm text-blue-400">
              {trace.pattern.errorFn}()
            </code>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <FileText className="h-4 w-4" />
            <span className="font-mono">{trace.source}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimeAgo(trace.createdAt)}</span>
            </div>
            <span>·</span>
            <span>{trace.session.label}</span>
            <span>·</span>
            <span className="font-mono">{trace.session.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">Execution path:</span>
            <div className="flex items-center gap-1">
              {trace.pattern.failurePath.map((fn, index) => (
                <div key={index} className="flex items-center gap-1">
                  <code className="rounded bg-zinc-800/30 px-1.5 py-0.5 text-xs text-zinc-500">
                    {fn}
                  </code>
                  {index < trace.pattern.failurePath.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-zinc-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center text-zinc-600 transition-colors group-hover:text-zinc-400">
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}