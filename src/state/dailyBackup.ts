import { getDateKey } from '../domain/stageEngine';
import { createBackupJson, type PersistedAppState } from './useAppStore';

export interface DailyBackupSnapshot {
  dateKey: string;
  savedAt: string;
  backupJson: string;
}

export interface BackupStoreBackend {
  getAll(): Promise<DailyBackupSnapshot[]>;
  put(snapshot: DailyBackupSnapshot): Promise<void>;
  remove(dateKey: string): Promise<void>;
}

const DB_NAME = 'anchor-daily-backups';
const STORE_NAME = 'snapshots';
const DB_VERSION = 1;
export const MAX_DAILY_SNAPSHOTS = 7;

function openBackupDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'dateKey' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export const indexedDbBackupBackend: BackupStoreBackend = {
  async getAll() {
    const db = await openBackupDb();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => {
          const items = (req.result as DailyBackupSnapshot[]) ?? [];
          resolve(items.sort((a, b) => b.dateKey.localeCompare(a.dateKey)));
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      } finally {
        db.close();
      }
    });
  },
  async put(snapshot) {
    const db = await openBackupDb();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(snapshot);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      } finally {
        db.close();
      }
    });
  },
  async remove(dateKey) {
    const db = await openBackupDb();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(dateKey);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      } finally {
        db.close();
      }
    });
  },
};

/**
 * Runs at most once per calendar day on first app open.
 * Stores a versioned JSON snapshot in IndexedDB (separate from localStorage),
 * keeps the last 7 daily snapshots, and asks the browser for persistent storage.
 */
export async function runDailyBackupIfNeeded(
  state: PersistedAppState,
  dateKey: string = getDateKey(),
  backend: BackupStoreBackend = indexedDbBackupBackend,
): Promise<boolean> {
  if (!state.hasCompletedOnboarding) return false;

  // Ask Android/desktop browsers to protect Anchor's storage from automatic eviction
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }

  const existing = await backend.getAll();
  if (existing.some((snap) => snap.dateKey === dateKey)) {
    return false;
  }

  const snapshot: DailyBackupSnapshot = {
    dateKey,
    savedAt: new Date().toISOString(),
    backupJson: createBackupJson(state),
  };
  await backend.put(snapshot);

  // Prune snapshots beyond MAX_DAILY_SNAPSHOTS (newest first)
  const updated = [snapshot, ...existing].sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey),
  );
  const toDelete = updated.slice(MAX_DAILY_SNAPSHOTS);
  for (const old of toDelete) {
    await backend.remove(old.dateKey);
  }

  return true;
}

export async function listDailyBackups(
  backend: BackupStoreBackend = indexedDbBackupBackend,
): Promise<DailyBackupSnapshot[]> {
  return backend.getAll();
}
