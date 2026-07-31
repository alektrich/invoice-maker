"use client";

import { useCallback, useSyncExternalStore } from "react";

// Local writes don't fire the `storage` event (that only fires in *other* tabs),
// so we keep our own listener set and notify it on every write.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * State backed by localStorage, read through `useSyncExternalStore` so the
 * stored value is picked up on hydration without a setState-in-effect pass.
 *
 * `parse` must be a stable reference (define it at module scope) and returns
 * `null` for stored values that aren't valid.
 */
export function useLocalStorageState<T extends string>(
  key: string,
  fallback: T,
  parse: (raw: string) => T | null
): [T, (value: T) => void] {
  const getSnapshot = useCallback(() => {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return parse(raw) ?? fallback;
  }, [key, fallback, parse]);

  // The server render has no localStorage, so it always sees the fallback.
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      localStorage.setItem(key, next);
      notify();
    },
    [key]
  );

  return [value, setValue];
}
