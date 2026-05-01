import type { Severity, Runtime, TraceStatus, TraceType } from "@/types/api";

export interface ErrorGroup {
  _id?: string;
  apiKey?: string;
  fingerprint: string;
  errorName: string;
  message: string;
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  severity: Severity;
  affectedFunctions?: string[];
  environments?: string[];
}

export interface TraceEventError {
  fingerprint: string;
  name: string;
  message: string;
  stack?: string;
}

export interface TraceEnvironment {
  runtime: Runtime;
  sdkVersion: string;
  appEnvironment: string;
}

export interface TraceEvent {
  _id?: string;
  traceId: string;
  parentId?: string | null;
  rootTraceId: string;
  sessionId: string;
  name: string;
  type: TraceType;
  status: TraceStatus;
  severity: Severity;
  timestamp: string | number;
  duration: number;
  error?: TraceEventError;
  metadata?: Record<string, unknown>;
  tags?: string[];
  environment: TraceEnvironment;
  createdAt?: string;
}

export interface ErrorGroupDetailResponse {
  group: ErrorGroup;
  recentEvents: TraceEvent[];
}
