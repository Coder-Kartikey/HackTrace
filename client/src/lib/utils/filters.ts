export function isWithinRange(value: string, range: string) {
  const lastSeen = new Date(value).getTime();

  if (!Number.isFinite(lastSeen)) {
    return false;
  }

  const now = Date.now();
  const days =
    range === "7d" ? 7 :
    range === "90d" ? 90 :
    30;

  return now - lastSeen <= days * 24 * 60 * 60 * 1000;
}
