import { Lightbulb, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import type { TraceDetail } from '../mockData';

interface ExplanationPanelProps {
  trace: TraceDetail;
}

export function ExplanationPanel({ trace }: ExplanationPanelProps) {
  const severityConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: AlertTriangle },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle },
    critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
  };

  const config = severityConfig[trace.voice.severity];
  const SeverityIcon = config.icon;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg text-white">AI Analysis</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500">
              Confidence: <span className="text-white">{(trace.voice.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1 ${config.bg}`}>
              <SeverityIcon className={`h-3.5 w-3.5 ${config.color}`} />
              <span className={`text-xs ${config.color} capitalize`}>{trace.voice.severity}</span>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
            <Lightbulb className="h-4 w-4" />
            <span>What happened</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{trace.explanation}</p>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Suggested Fix</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{trace.suggestedFix}</p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-3 text-sm text-zinc-400">Pattern Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-600">Error Type</div>
            <div className="mt-1 text-sm text-white">{trace.pattern.type}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-600">Error Function</div>
            <div className="mt-1 text-sm text-white">
              <code className="rounded bg-zinc-800/50 px-2 py-0.5">{trace.pattern.errorFn}()</code>
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-zinc-600">Failure Path</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {trace.pattern.failurePath.map((fn, index) => (
                <code
                  key={index}
                  className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {fn}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}