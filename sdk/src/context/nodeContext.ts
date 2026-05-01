import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<string[]>();
let fallbackStore: string[] | null = null;

function getStore(): string[] | null {
  return asyncLocalStorage.getStore() ?? fallbackStore;
}

export function runWithContext<T>(fn: () => Promise<T> | T, initialStore: string[] = []): Promise<T> | T {
  return asyncLocalStorage.run([...initialStore], () => fn());
}

export function hasContext(): boolean {
  return getStore() !== null;
}

export function bindContext<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  initialStore?: string[]
): (...args: TArgs) => TResult {
  const store = initialStore ? [...initialStore] : [...(getStore() ?? [])];
  return (...args: TArgs) => runWithContext(() => fn(...args), store) as TResult;
}

export function pushSpan(spanId: string) {
  const store = getStore();
  if (store) {
    store.push(spanId);
    return;
  }

  fallbackStore = [spanId];
}

export function popSpan() {
  const store = getStore();
  if (store) {
    store.pop();

    if (store.length === 0 && store === fallbackStore) {
      fallbackStore = null;
    }
  }
}

export function getCurrentSpan(): string | undefined {
  const store = getStore();
  return store ? store[store.length - 1] : undefined;
}

export function getRootSpan(): string | undefined {
  const store = getStore();
  return store ? store[0] : undefined;
}
