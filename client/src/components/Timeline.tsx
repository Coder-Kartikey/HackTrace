type TraceEvent = {
  fn: string;
  time: number;
  error?: string;
};

export default function Timeline({ trace }: { trace: TraceEvent[] }) {
  return (
    <div className="border rounded p-4 space-y-2">
      {trace.map((event, idx) => (
        <div
          key={idx}
          className={`p-2 rounded ${
            event.error ? "bg-red-600 text-red-900" : "bg-gray-600"
          }`}
        >
          <span className="font-mono">{event.fn}</span>
          <span className="text-sm ml-2 text-gray-400">
            {event.time}ms
          </span>
          {event.error && (
            <div className="text-sm mt-1">❌ {event.error}</div>
          )}
        </div>
      ))}
    </div>
  );
}
