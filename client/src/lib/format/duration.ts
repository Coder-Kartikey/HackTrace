export function formatDuration(duration?: number | null) {
  if (duration == null || Number.isNaN(duration)) {
    return "N/A";
  }

  if (duration >= 1000) {
    return `${(duration / 1000).toFixed(2)} s`;
  }

  return `${duration.toFixed(2)} ms`;
}
