export function normalizeStack(stack?: string | null) {
  return stack?.trim() || "No stack trace available.";
}
