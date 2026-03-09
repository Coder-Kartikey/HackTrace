let spanStack: string[] = [];

export function runWithContext<T>(fn: () => T): T {
  return fn();
}

export function pushSpan(spanId: string) {
  spanStack.push(spanId);
}

export function popSpan() {
  spanStack.pop();
}

export function getCurrentSpan(): string | undefined {
  return spanStack[spanStack.length - 1];
}
