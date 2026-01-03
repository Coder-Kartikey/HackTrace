export async function fetchAllTraces() {
  const res = await fetch("http://localhost:5000/api/traces");
  return res.json();
}

export async function fetchTraceById(id: string) {
  const res = await fetch(`http://localhost:5000/api/traces/${id}`);
  return res.json();
}
