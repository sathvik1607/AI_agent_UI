import { useState, useEffect } from 'react';

/**
 * Drop-in replacement for useState that mirrors state to localStorage.
 *
 * Reads the stored value on mount (lazy init) and syncs after every change.
 * An optional `validate` predicate lets callers reject stored values that
 * fail domain invariants — for example, rejecting an empty conversations array
 * so that a fresh conversation is created instead of showing a blank sidebar.
 *
 * Failures (JSON parse errors, quota exceeded, private browsing) are handled
 * silently: the hook degrades gracefully to in-memory state.
 *
 * @template T
 * @param {string} storageKey
 * @param {T | (() => T)} initialValue  - factory function or plain value used when nothing is stored
 * @param {((parsed: T) => boolean) | null} validate  - return false to reject the stored value
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
export const useLocalStorage = (storageKey, initialValue, validate = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (!validate || validate(parsed)) return parsed;
      }
    } catch {
      // Corrupted or unreadable entry — fall through to initialValue
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(storedValue));
    } catch {
      // Quota exceeded or private browsing — state still works in-memory
    }
  }, [storageKey, storedValue]);

  return [storedValue, setStoredValue];
};
