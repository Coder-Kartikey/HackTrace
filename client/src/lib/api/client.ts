import type { ApiError } from "@/types/api";
import { getApiConfig } from "@/lib/api/config";

export class ApiRequestError extends Error {
  status?: number;
  details?: string[];

  constructor({ message, status, details }: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

function toApiError(status: number, payload: unknown): ApiError {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    const details =
      "details" in payload && Array.isArray(payload.details)
        ? payload.details.filter((detail): detail is string => typeof detail === "string")
        : undefined;

    return {
      message: payload.error,
      status,
      details
    };
  }

  return {
    message: `Request failed with status ${status}`,
    status
  };
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const { apiUrl, apiKey } = getApiConfig();

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...(init?.headers ?? {})
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(toApiError(response.status, payload));
  }

  return payload as T;
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}
