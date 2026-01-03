export async function fetchLatestTrace() {
  const res = await fetch("http://localhost:5000/api/traces/latest");
  return res.json();
}
