import { describe, expect, it } from 'vitest';
import {
  MAX_DAILY_SNAPSHOTS,
  runDailyBackupIfNeeded,
  type BackupStoreBackend,
  type DailyBackupSnapshot,
} from './dailyBackup';
import { INITIAL_PERSISTED_STATE, parseBackupJson } from './useAppStore';

function createMemoryBackend(): BackupStoreBackend & { items: Map<string, DailyBackupSnapshot> } {
  const items = new Map<string, DailyBackupSnapshot>();
  return {
    items,
    async getAll() {
      return Array.from(items.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    },
    async put(snapshot) {
      items.set(snapshot.dateKey, snapshot);
    },
    async remove(dateKey) {
      items.delete(dateKey);
    },
  };
}

describe('runDailyBackupIfNeeded', () => {
  const onboardedState = {
    ...INITIAL_PERSISTED_STATE,
    hasCompletedOnboarding: true,
    parentName: 'Ishaan',
    babyName: 'Aarav',
    babyDob: '2026-10-01',
  };

  it('saves once on first open of the day and skips subsequent opens the same day', async () => {
    const backend = createMemoryBackend();

    const first = await runDailyBackupIfNeeded(onboardedState, '2026-11-26', backend);
    const second = await runDailyBackupIfNeeded(onboardedState, '2026-11-26', backend);

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(backend.items.size).toBe(1);

    const snap = backend.items.get('2026-11-26')!;
    const parsed = parseBackupJson(snap.backupJson);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state.parentName).toBe('Ishaan');
      expect(parsed.state.babyName).toBe('Aarav');
    }
  });

  it('skips backup before onboarding is completed', async () => {
    const backend = createMemoryBackend();
    const ran = await runDailyBackupIfNeeded(INITIAL_PERSISTED_STATE, '2026-11-26', backend);
    expect(ran).toBe(false);
    expect(backend.items.size).toBe(0);
  });

  it('prunes old snapshots beyond the rolling 7-day window', async () => {
    const backend = createMemoryBackend();
    for (let day = 1; day <= MAX_DAILY_SNAPSHOTS + 3; day++) {
      const dateKey = `2026-11-${String(day).padStart(2, '0')}`;
      await runDailyBackupIfNeeded(onboardedState, dateKey, backend);
    }
    const all = await backend.getAll();
    expect(all.length).toBe(MAX_DAILY_SNAPSHOTS);
    expect(all[0]?.dateKey).toBe('2026-11-10');
    expect(all[all.length - 1]?.dateKey).toBe('2026-11-04');
  });
});
