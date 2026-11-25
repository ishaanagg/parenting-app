export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * LocalStorage adapter with safe fallback for SSR/restricted environments.
 * Swappable for IndexedDB or remote sync in future versions.
 */
export const localStorageAdapter: StorageAdapter = {
  getItem(key) {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore quota/private-mode errors gracefully
    }
  },
  removeItem(key) {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore gracefully
    }
  },
};
