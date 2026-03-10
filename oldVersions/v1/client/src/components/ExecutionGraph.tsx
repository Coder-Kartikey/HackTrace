import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TraceDetail } from '../mockData';

interface ExecutionGraphProps {
  trace: TraceDetail;
}

export function ExecutionGraph({ trace }: ExecutionGraphProps) {
  const data = trace.trace.stack.map((item) => ({
    name: item.function,
    duration: item.duration,
    file: item.file,
  }));

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-lg text-white">Execution Duration by Function</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft', fill: '#71717a' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#e4e4e7',
              }}
              labelStyle={{ color: '#e4e4e7' }}
            />
            <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-zinc-500">
        Total execution time: <span className="text-white">{trace.trace.totalDuration}ms</span>
      </div>
    </div>
  );
}