export function generateFingerprint(error: Error): string {
  const normalizedStack = normalizeStack(error.stack || "");

  const base = error.name + "|" + error.message + "|" + normalizedStack;

  return hash(base);
}

function normalizeStack(stack: string): string {
  return stack
    .split("\n")
    .slice(1, 4) // only top 3 frames
    .map(line =>
      line
        .replace(/\(.*?\)/g, "") // remove file paths
        .replace(/:\d+:\d+/g, "") // remove line numbers
        .trim()
    )
    .join("|");
}

function hash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}
