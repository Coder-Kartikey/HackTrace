import { useEffect, useState } from "react";
import Timeline from "../components/Timeline";
import { fetchLatestTrace } from "../api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchLatestTrace().then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">HackTrace 🧠</h1>

      <h2 className="text-xl font-semibold mb-2">Execution Timeline</h2>
      <Timeline trace={data.trace} />

      <h2 className="text-xl font-semibold mt-6 mb-2">AI Explanation</h2>
      <div className="bg-gray-600 border rounded p-4">
        {data.explanation}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Voice Explanation
      </h2>
      <audio
        controls
        src={`data:audio/mp3;base64,${data.voice}`}
      />
    </div>
  );
}
