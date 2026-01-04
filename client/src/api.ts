const API_BASE = import.meta.env.VITE_API_BASE;

export async function getTraces() {
  const res = await fetch(`${API_BASE}/traces`);
  if (!res.ok) throw new Error("Failed to fetch traces");
  return res.json();
}

export async function getTraceById(id: string) {
  const res = await fetch(`${API_BASE}/traces/${id}`);
  if (!res.ok) throw new Error("Failed to fetch trace");
  return res.json();
}
