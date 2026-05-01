import { fetchJson } from "@/lib/api/client";
import type { TraceEvent } from "@/types/error";

export function fetchTrace(traceId: string) {
  return fetchJson<TraceEvent[]>(`/traces/${traceId}`);
}
