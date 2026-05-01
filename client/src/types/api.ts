export type Severity = "info" | "warning" | "critical";
export type TraceStatus = "success" | "error";
export type TraceType = "function" | "span" | "manual";
export type Runtime = "browser" | "node";

export interface ApiError {
  message: string;
  status?: number;
  details?: string[];
}

export interface HealthResponse {
  status: "ok";
}
