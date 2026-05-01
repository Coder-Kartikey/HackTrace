export function formatDateTime(value?: string | number | null) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

export function formatRelativeDayLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
