import { useEffect, useState } from "react";
import Timeline from "../components/Timeline";
import TraceList from "../components/TraceList";
import { fetchAllTraces, fetchTraceById } from "../api";
import ExecutionGraph from "../components/ExecutionGraph";
import { traceToGraph } from "../utils/traceToGraph";
import PatternBadge from "../components/PatternBadge";


type TraceType = any;

export default function Dashboard() {
  const [traces, setTraces] = useState<TraceType[]>([]);
  const [activeTrace, setActiveTrace] = useState<TraceType | null>(null);

  const [compareMode, setCompareMode] = useState(false);
  const [compareTraces, setCompareTraces] = useState<TraceType[]>([]);

  const [viewMode, setViewMode] = useState<"timeline" | "graph">("timeline");


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllTraces().then(setTraces);
  }, []);

  const loadTrace = async (id: string) => {
    setLoading(true);
    const data = await fetchTraceById(id);

    if (!compareMode) {
      setActiveTrace(data);
    } else {
      if (compareTraces.length < 2) {
        setCompareTraces((prev) => [...prev, data]);
      }
    }

    setLoading(false);
  };

  const resetComparison = () => {
    setCompareMode(false);
    setCompareTraces([]);
    setActiveTrace(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-72 border-r bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Trace History</h2>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 rounded ${viewMode === "timeline"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            Timeline
          </button>

          <button
            onClick={() => setViewMode("graph")}
            className={`px-3 py-1 rounded ${viewMode === "graph"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            Execution Graph
          </button>
        </div>


        <button
          onClick={() => {
            setCompareMode(!compareMode);
            setCompareTraces([]);
            setActiveTrace(null);
          }}
          className="mb-4 w-full text-sm bg-blue-600 text-white rounded px-3 py-1"
        >
          {compareMode ? "Exit Compare Mode" : "Compare Traces"}
        </button>

        <TraceList traces={traces} onSelect={loadTrace} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">HackTrace 🧠</h1>

        {loading && <div>Loading trace...</div>}

        {/* ---------- NORMAL MODE ---------- */}
        {!compareMode && activeTrace && !loading && (
          <>
            <SectionHeader
              title={activeTrace.session?.label || "Unnamed Session"}
              subtitle={new Date(activeTrace.createdAt).toLocaleString()}
            />

            {/* Pattern Insight */}
            <PatternBadge pattern={activeTrace.pattern} />


            {viewMode === "timeline" ? (
              <Timeline trace={activeTrace.trace} />
            ) : (
              <ExecutionGraph
                graph={traceToGraph(activeTrace.trace)}
              />
            )}

            <TextBlock title="AI Explanation" text={activeTrace.explanation} />

            <TextBlock
              title="Suggested Fix"
              text={activeTrace.suggestedFix || "No suggestion available."}
              highlight
            />

            <AudioBlock voice={activeTrace.voice} />
          </>
        )}

        {!compareMode && !activeTrace && !loading && (
          <EmptyState text="Select a trace from the left to view details." />
        )}

        {/* ---------- COMPARISON MODE ---------- */}
        {compareMode && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Trace Comparison
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Select two traces to compare execution flow.
            </p>

            {compareTraces.length < 2 && (
              <EmptyState text="Select two traces from the sidebar." />
            )}

            {compareTraces.length === 2 && (
              <>
                <button
                  onClick={resetComparison}
                  className="mb-4 text-sm text-blue-600 underline"
                >
                  Reset Comparison
                </button>

                <ComparisonView
                  traceA={compareTraces[0]}
                  traceB={compareTraces[1]}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function SectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function TimelineSection({ trace }: { trace: any[] }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Execution Timeline</h3>
      <Timeline trace={trace} />
    </>
  );
}

function TextBlock({
  title,
  text,
  highlight
}: {
  title: string;
  text: string;
  highlight?: boolean;
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{title}</h3>
      <div
        className={`border rounded p-4 ${highlight
          ? "bg-green-50 border-green-200"
          : "bg-white"
          }`}
      >
        {text}
      </div>
    </>
  );
}

function AudioBlock({ voice }: { voice: string }) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">
        Voice Explanation
      </h3>
      <audio
        controls
        className="w-full"
        src={`data:audio/mp3;base64,${voice}`}
      />
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-gray-500 mt-10 text-center">
      {text}
    </div>
  );
}

/* ================= COMPARISON ================= */

function ComparisonView({
  traceA,
  traceB
}: {
  traceA: any;
  traceB: any;
}) {
  const diffs = diffTraces(traceA.trace, traceB.trace);

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <h3 className="font-semibold">
        {traceA.session?.label || "Trace A"} vs{" "}
        {traceB.session?.label || "Trace B"}
      </h3>

      {diffs.length === 0 && (
        <div className="text-green-600">
          No differences detected in execution flow.
        </div>
      )}

      {diffs.slice(0, 6).map((d, idx) => (
        <div key={idx} className="text-sm">
          <strong>Step {d.index}:</strong>{" "}
          <span className="text-green-600">
            {d.a || "—"}
          </span>{" "}
          vs{" "}
          <span className="text-red-600">
            {d.b || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

function diffTraces(a: any[], b: any[]) {
  const aFns = a.map((e) => e.fn);
  const bFns = b.map((e) => e.fn);

  const maxLen = Math.max(aFns.length, bFns.length);
  const diffs = [];

  for (let i = 0; i < maxLen; i++) {
    if (aFns[i] !== bFns[i]) {
      diffs.push({
        index: i,
        a: aFns[i],
        b: bFns[i]
      });
    }
  }

  return diffs;
}
