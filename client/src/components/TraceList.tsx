import { Activity, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchAllTraces } from '../api';
import { mockTraces, type TraceListItem as TraceListItemType } from '../mockData';
import { TraceListItem } from './TraceListItem';

export function TraceList() {
  const [traces, setTraces] = useState<TraceListItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const mapApiTrace = (item: any): TraceListItemType | null => {
      if (!item) return null;
      const id = item._id ?? item.id ?? item.traceId;
      if (!id) return null;

      return {
        _id: String(id),
        session: {
          id: item.session?.id ?? 'unknown',
          label: item.session?.label ?? 'Unknown session',
        },
        source: item.source ?? 'unknown',
        pattern: {
          type: item.pattern?.type ?? 'Unknown',
          errorFn: item.pattern?.errorFn ?? 'unknown',
          failurePath: Array.isArray(item.pattern?.failurePath)
            ? item.pattern.failurePath
            : [],
        },
        createdAt: item.createdAt ?? new Date().toISOString(),
      };
    };

    const loadTraces = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      try {
        const data = await fetchAllTraces();
        const normalized = Array.isArray(data)
          ? (data.map(mapApiTrace).filter(Boolean) as TraceListItemType[])
          : [];

        if (normalized.length && isMounted) {
          setTraces(normalized);
          return;
        }

        // If API returns empty or unusable data, fall back to mock samples
        if (isMounted) {
          setTraces(mockTraces);
          setUsingFallback(true);
          setError('Live data unavailable. Showing sample traces.');
        }
      } catch (err) {
        console.error('Failed to fetch traces', err);
        if (isMounted) {
          setTraces(mockTraces);
          setUsingFallback(true);
          setError('Could not load live traces. Showing sample data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTraces();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl text-white">
            <Activity className="h-7 w-7 text-blue-400" />
            Execution Traces
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Captured runtime failures and execution patterns
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {loading && (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
          Loading traces...
        </div>
      )}

      {!loading && error && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          {error}
        </div>
      )}

      <div className="mb-4 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-500">Total Traces</div>
          <div className="mt-1 text-2xl text-white">{traces.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-500">Last 24h</div>
          <div className="mt-1 text-2xl text-white">3</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-500">Patterns Detected</div>
          <div className="mt-1 text-2xl text-white">4</div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-500">Avg Response Time</div>
          <div className="mt-1 text-2xl text-white">287ms</div>
        </div>
      </div>

      <div className="space-y-3">
        {traces.map((trace) => (
          <TraceListItem key={trace._id} trace={trace} />
        ))}
      </div>

      {!loading && !traces.length && (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-zinc-400">
          {usingFallback
            ? 'No sample traces available.'
            : 'No traces found yet.'}
        </div>
      )}
    </div>
  );
}