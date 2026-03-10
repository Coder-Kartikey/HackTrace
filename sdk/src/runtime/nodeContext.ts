import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<string[]>();

export function runWithSpanStack<T>(fn: () => T): T {
  return asyncLocalStorage.run([], fn);
}

export function getSpanStack(): string[] {
  return asyncLocalStorage.getStore() || [];
}

export function pushSpan(spanId: string) {
  const stack = getSpanStack();
  stack.push(spanId);
}

export function popSpan() {
  const stack = getSpanStack();
  stack.pop();
}

export function getCurrentSpan(): string | undefined {
  const stack = getSpanStack();
  return stack[stack.length - 1];
}
