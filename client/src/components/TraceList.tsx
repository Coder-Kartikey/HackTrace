type TraceItem = {
  _id: string;
  session?: {
    label?: string;
  };
  createdAt: string;
};

export default function TraceList({
  traces,
  onSelect
}: {
  traces: TraceItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {traces.map((t) => (
        <button
          key={t._id}
          onClick={() => onSelect(t._id)}
          className="w-full text-left p-2 rounded bg-white hover:bg-gray-100 border"
        >
          <div className="font-medium">
            {t.session?.label || "Unnamed Session"}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(t.createdAt).toLocaleString()}
          </div>
        </button>
      ))}
    </div>
  );
}
