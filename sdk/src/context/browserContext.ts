type ContextStore = string[];

let currentStore: ContextStore | null = null;
let patchedAsyncApis = false;
const promiseStores = new WeakMap<Promise<unknown>, ContextStore>();

function cloneStore(store: ContextStore | null): ContextStore {
  return store ? [...store] : [];
}

function withCapturedContext<TArgs extends unknown[], TResult>(
  callback: ((...args: TArgs) => TResult) | undefined,
  store: ContextStore
): ((...args: TArgs) => TResult) | undefined {
  if (!callback) {
    return undefined;
  }

  return (...args: TArgs) => runWithContext(() => callback(...args), store);
}

function getPromiseStore(promise: Promise<unknown>): ContextStore {
  const store = promiseStores.get(promise);
  return cloneStore(store ?? currentStore);
}

function setPromiseStore(promise: Promise<unknown>, store: ContextStore): void {
  promiseStores.set(promise, cloneStore(store));
}

function patchSchedulerApis(): void {
  const originalSetTimeout = window.setTimeout.bind(window);
  const patchedSetTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const store = cloneStore(currentStore);

    if (typeof handler === "function") {
      return originalSetTimeout(
        (...handlerArgs: unknown[]) => runWithContext(() => handler(...handlerArgs), store),
        timeout,
        ...args
      );
    }

    return originalSetTimeout(handler, timeout, ...args);
  }) as typeof window.setTimeout;

  window.setTimeout = patchedSetTimeout;
  globalThis.setTimeout = patchedSetTimeout;

  const originalSetInterval = window.setInterval.bind(window);
  const patchedSetInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const store = cloneStore(currentStore);

    if (typeof handler === "function") {
      return originalSetInterval(
        (...handlerArgs: unknown[]) => runWithContext(() => handler(...handlerArgs), store),
        timeout,
        ...args
      );
    }

    return originalSetInterval(handler, timeout, ...args);
  }) as typeof window.setInterval;

  window.setInterval = patchedSetInterval;
  globalThis.setInterval = patchedSetInterval;

  const originalQueueMicrotask = globalThis.queueMicrotask.bind(globalThis);
  const patchedQueueMicrotask = ((callback: VoidFunction) => {
    const store = cloneStore(currentStore);
    originalQueueMicrotask(() => {
      runWithContext(callback, store);
    });
  }) as typeof globalThis.queueMicrotask;

  window.queueMicrotask = patchedQueueMicrotask;
  globalThis.queueMicrotask = patchedQueueMicrotask;

  if (typeof window.requestAnimationFrame === "function") {
    const originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);
    const patchedRequestAnimationFrame = ((callback: FrameRequestCallback) => {
      const store = cloneStore(currentStore);
      return originalRequestAnimationFrame((timestamp) => {
        runWithContext(() => callback(timestamp), store);
      });
    }) as typeof window.requestAnimationFrame;

    window.requestAnimationFrame = patchedRequestAnimationFrame;
  }
}

function patchPromiseApis(): void {
  const originalThen = Promise.prototype.then;
  const originalCatch = Promise.prototype.catch;
  const originalFinally = Promise.prototype.finally;

  Promise.prototype.then = function patchedThen<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const store = getPromiseStore(this);
    setPromiseStore(this, store);

    const result = originalThen.call(
      this,
      withCapturedContext(onfulfilled ?? undefined, store),
      withCapturedContext(onrejected ?? undefined, store)
    );

    setPromiseStore(result, store);
    return result;
  };

  Promise.prototype.catch = function patchedCatch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<unknown | TResult> {
    const store = getPromiseStore(this);
    setPromiseStore(this, store);

    const result = originalCatch.call(this, withCapturedContext(onrejected ?? undefined, store));
    setPromiseStore(result, store);
    return result;
  };

  Promise.prototype.finally = function patchedFinally(
    onfinally?: (() => void) | null
  ): Promise<unknown> {
    const store = getPromiseStore(this);
    setPromiseStore(this, store);

    const result = originalFinally.call(this, withCapturedContext(onfinally ?? undefined, store));
    setPromiseStore(result, store);
    return result;
  };

  const originalResolve = Promise.resolve.bind(Promise);
  Promise.resolve = ((value: unknown) => {
    const result = originalResolve(value);
    setPromiseStore(result, result instanceof Promise ? getPromiseStore(result) : cloneStore(currentStore));
    return result;
  }) as typeof Promise.resolve;

  const originalReject = Promise.reject.bind(Promise);
  Promise.reject = ((reason?: unknown) => {
    const result = originalReject(reason);
    setPromiseStore(result, cloneStore(currentStore));
    return result;
  }) as typeof Promise.reject;

  const originalAll = Promise.all.bind(Promise);
  Promise.all = ((values: Iterable<unknown>) => {
    const result = originalAll(values);
    setPromiseStore(result, cloneStore(currentStore));
    return result;
  }) as typeof Promise.all;

  const originalRace = Promise.race.bind(Promise);
  Promise.race = ((values: Iterable<unknown>) => {
    const result = originalRace(values);
    setPromiseStore(result, cloneStore(currentStore));
    return result;
  }) as typeof Promise.race;

  const originalAllSettled = Promise.allSettled.bind(Promise);
  Promise.allSettled = ((values: Iterable<unknown>) => {
    const result = originalAllSettled(values);
    setPromiseStore(result, cloneStore(currentStore));
    return result;
  }) as typeof Promise.allSettled;

  if (typeof Promise.any === "function") {
    const originalAny = Promise.any.bind(Promise);
    Promise.any = ((values: Iterable<unknown>) => {
      const result = originalAny(values);
      setPromiseStore(result, cloneStore(currentStore));
      return result;
    }) as typeof Promise.any;
  }
}

function patchAsyncApis(): void {
  if (patchedAsyncApis || typeof window === "undefined") {
    return;
  }

  patchedAsyncApis = true;
  patchSchedulerApis();
  patchPromiseApis();
}

export function runWithContext<T>(fn: () => T, initialStore?: string[]): T {
  patchAsyncApis();

  const previousStore = currentStore;
  currentStore = initialStore ? [...initialStore] : cloneStore(previousStore);

  try {
    const result = fn();

    if (result instanceof Promise) {
      setPromiseStore(result, currentStore);
    }

    return result;
  } finally {
    currentStore = previousStore;
  }
}

export function hasContext(): boolean {
  return currentStore !== null;
}

export function bindContext<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  initialStore?: string[]
): (...args: TArgs) => TResult {
  const store = initialStore ? [...initialStore] : cloneStore(currentStore);
  return (...args: TArgs) => runWithContext(() => fn(...args), store);
}

export function pushSpan(spanId: string) {
  if (!currentStore) {
    currentStore = [];
  }

  currentStore.push(spanId);
}

export function popSpan() {
  currentStore?.pop();

  if (currentStore?.length === 0) {
    currentStore = null;
  }
}

export function getCurrentSpan(): string | undefined {
  return currentStore ? currentStore[currentStore.length - 1] : undefined;
}

export function getRootSpan(): string | undefined {
  return currentStore ? currentStore[0] : undefined;
}
