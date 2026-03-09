import { Severity } from "../types";

export function classifyError(error: Error): Severity {
  const name = error.name.toLowerCase();

  if (
    name.includes("reference") ||
    name.includes("type") ||
    name.includes("syntax")
  ) {
    return "critical";
  }

  if (name.includes("network") || name.includes("timeout")) {
    return "warning";
  }

  return "warning";
}
