import { ArrowLeft, Clock, FileText, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTraceById } from '../api';
import { getTraceDetail, type TraceDetail as TraceDetailType } from '../mockData';
import { PatternBadge } from './PatternBadge';
import { ExecutionGraph } from './ExecutionGraph';
import { Timeline } from './Timeline';
import { ExplanationPanel } from './ExplanationPanel';

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

export function TraceDetail() {
  const { id } = useParams<{ id: string }>();
  const [trace, setTrace] = useState<TraceDetailType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const mapApiTraceDetail = (item: any): TraceDetailType | null => {
      if (!item) return null;
      const stack = Array.isArray(item.trace)
        ? item.trace.map((entry: any, index: number) => ({
            function: entry.fn ?? entry.function ?? `step_${index + 1}`,
            file: entry.file ?? entry.source ?? 'unknown',
            line: entry.line ?? 0,
            column: entry.column ?? 0,
            duration: entry.duration ?? entry.time ?? 0,
          }))
        : [];

      const failurePathRaw = item.pattern?.failurePath;
      const failurePath = Array.isArray(failurePathRaw)
        ? failurePathRaw
        : typeof failurePathRaw === 'string'
          ? failurePathRaw.split('>')
          : [];

      const totalDuration = stack.reduce((sum, cur) => sum + (Number(cur.duration) || 0), 0);

      return {
        _id: item._id ?? item.id ?? 'unknown',
        session: {
          id: item.session?.id ?? 'unknown',
          label: item.session?.label ?? 'Unknown session',
        },
        source: item.source ?? 'unknown',
        pattern: {
          type: item.pattern?.type ?? 'Unknown',
          errorFn: item.pattern?.errorFn ?? failurePath[failurePath.length - 1] ?? 'unknown',
          failurePath,
        },
        createdAt: item.createdAt ?? new Date().toISOString(),
        trace: {
          stack: stack.length
            ? stack
            : failurePath.map((fn: string, index: number) => ({
                function: fn,
                file: 'unknown',
                line: 0,
                column: 0,
                duration: 0,
              })),
          totalDuration,
          errorMessage: item.trace?.errorMessage ?? item.errorMessage ?? 'No error message provided.',
        },
        explanation: item.explanation ?? 'No explanation provided.',
        suggestedFix: item.suggestedFix ?? 'No suggested fix provided.',
        voice: {
          confidence: typeof item.voiceConfidence === 'number' ? item.voiceConfidence : 0.75,
          severity: (item.voiceSeverity as TraceDetailType['voice']['severity']) ?? 'medium',
        },
      };
    };

    const loadTrace = async () => {
      if (!id) {
        setTrace(undefined);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchTraceById(id);
        const normalized = mapApiTraceDetail(data);

        if (normalized && isMounted) {
          setTrace(normalized);
          setLoading(false);
          return;
        }

        // Fallback to mock detail if API does not provide compatible data
        if (isMounted) {
          const mock = getTraceDetail(id);
          setTrace(mock);
          setError('Live trace data incomplete. Showing sample data.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch trace detail', err);
        if (isMounted) {
          const mock = getTraceDetail(id);
          setTrace(mock);
          setError('Could not load live trace. Showing sample data.');
          setLoading(false);
        }
      }
    };

    loadTrace();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!trace) {
    if (loading) {
      return (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
            Loading trace...
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-zinc-400">Trace not found</p>
          <Link to="/" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            Return to trace list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to traces
      </Link>

      <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        {error && (
          <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {error}
          </div>
        )}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <PatternBadge type={trace.pattern.type} size="lg" />
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300">
                <Copy className="h-3.5 w-3.5" />
                Copy Trace ID
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <FileText className="h-4 w-4" />
              <span className="font-mono">{trace.source}</span>
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-zinc-500">Trace ID</div>
            <code className="mt-1 block rounded bg-zinc-800/50 px-2 py-1 font-mono text-zinc-300">
              {trace._id}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t border-zinc-800 pt-4 text-sm">
          <div>
            <div className="text-xs text-zinc-600">Session</div>
            <div className="mt-1 text-zinc-300">{trace.session.label}</div>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div>
            <div className="text-xs text-zinc-600">Session ID</div>
            <div className="mt-1 font-mono text-zinc-300">{trace.session.id}</div>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-zinc-600" />
            <span className="text-zinc-400">{formatTimeAgo(trace.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ExecutionGraph trace={trace} />
          <Timeline trace={trace} />
        </div>

        <div className="lg:col-span-1">
          <ExplanationPanel trace={trace} />
        </div>
      </div>
    </div>
  );
}