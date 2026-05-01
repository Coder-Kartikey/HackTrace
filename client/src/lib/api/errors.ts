import { fetchJson } from "@/lib/api/client";
import type { ErrorGroup, ErrorGroupDetailResponse } from "@/types/error";

export interface ErrorFiltersState {
  q: string;
  severity: string;
  environment: string;
  sort: "lastSeen" | "occurrences" | "severity";
  page: number;
  range: string;
}

export function fetchErrors(page = 1) {
  return fetchJson<ErrorGroup[]>(`/errors?page=${page}`);
}

export function fetchErrorDetails(fingerprint: string) {
  return fetchJson<ErrorGroupDetailResponse>(`/errors/${fingerprint}`);
}
