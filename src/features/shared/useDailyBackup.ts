import { useEffect } from 'react';
import { getDateKey } from '../../domain/stageEngine';
import { runDailyBackupIfNeeded } from '../../state/dailyBackup';
import { useAppStore } from '../../state/useAppStore';
import { useNow } from './useNow';

/**
 * Triggers a silent daily snapshot in IndexedDB the first time Anchor is opened
 * on a new calendar day (and requests persistent browser storage).
 */
export function useDailyBackup() {
  const now = useNow();
  const dateKey = getDateKey(now);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    if (!hasCompletedOnboarding) return;
    runDailyBackupIfNeeded(useAppStore.getState(), dateKey).catch(() => {});
  }, [dateKey, hasCompletedOnboarding]);
}
