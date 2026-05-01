import { fetchJson } from "@/lib/api/client";
import type { HealthResponse } from "@/types/api";
import type { ErrorGroup } from "@/types/error";
import type { ErrorTrendPoint } from "@/types/overview";

export function fetchHealth() {
  return fetchJson<HealthResponse>("/health", {
    headers: {}
  });
}

export function fetchTopErrors() {
  return fetchJson<ErrorGroup[]>("/analytics/top-errors");
}

export function fetchErrorTrend() {
  return fetchJson<ErrorTrendPoint[]>("/analytics/error-trend");
}
