import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<string[]>();

export function runWithContext<T>(fn: () => Promise<T> | T): Promise<T> | T {
  return asyncLocalStorage.run([], () => fn());
}

export function pushSpan(spanId: string) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.push(spanId);
  }
}

export function popSpan() {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.pop();
  }
}

export function getCurrentSpan(): string | undefined {
  const store = asyncLocalStorage.getStore();
  return store ? store[store.length - 1] : undefined;
}
