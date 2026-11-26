export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const backupKeyFor = (key: string) => `${key}:backup`;

function isValidJson(raw: string | null): raw is string {
  if (!raw) return false;
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

/**
 * Wraps any Storage-like backend with automatic shadow backup & corruption recovery.
 * Every valid JSON write mirrors to `${key}:backup`; if the primary key is
 * missing or corrupted, reads recover automatically from the shadow copy.
 */
export function createSafeStorageAdapter(
  getBackend: () => StorageAdapter | null,
): StorageAdapter {
  return {
    getItem(key) {
      try {
        const backend = getBackend();
        if (!backend) return null;
        const primary = backend.getItem(key);
        if (isValidJson(primary)) return primary;

        const backup = backend.getItem(backupKeyFor(key));
        if (isValidJson(backup)) {
          try {
            backend.setItem(key, backup);
          } catch {
            // Ignore heal write failure
          }
          return backup;
        }
        return null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        const backend = getBackend();
        if (!backend) return;
        backend.setItem(key, value);
        if (isValidJson(value)) {
          try {
            backend.setItem(backupKeyFor(key), value);
          } catch {
            // Ignore shadow write quota errors gracefully
          }
        }
      } catch {
        // Ignore quota/private-mode errors gracefully
      }
    },
    removeItem(key) {
      try {
        const backend = getBackend();
        if (!backend) return;
        backend.removeItem(key);
        backend.removeItem(backupKeyFor(key));
      } catch {
        // Ignore gracefully
      }
    },
  };
}

export const localStorageAdapter: StorageAdapter = createSafeStorageAdapter(() =>
  typeof window !== 'undefined' && window.localStorage ? window.localStorage : null,
);
