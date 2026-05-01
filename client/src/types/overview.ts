import type { ErrorGroup } from "@/types/error";
import type { HealthResponse } from "@/types/api";

export interface ErrorTrendPoint {
  _id: string;
  count: number;
}

export interface OverviewStatsData {
  health: HealthResponse | null;
  topErrors: ErrorGroup[];
  trend: ErrorTrendPoint[];
  allErrors: ErrorGroup[];
}
