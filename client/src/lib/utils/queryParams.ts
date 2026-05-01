export function getSearchParam(
  value: string | string[] | undefined,
  fallback = ""
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function getNumberSearchParam(
  value: string | string[] | undefined,
  fallback = 1
) {
  const parsed = Number.parseInt(getSearchParam(value, String(fallback)), 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function createSearchParams(
  entries: Record<string, string | number | undefined>
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(entries)) {
    if (value == null || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  return params;
}
