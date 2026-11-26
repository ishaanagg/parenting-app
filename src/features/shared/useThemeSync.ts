import { useEffect } from 'react';
import { isNightHours } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';
import { useNow } from './useNow';

const THEME_COLORS = {
  day: '#F7F3EC',
  night: '#110E0C',
} as const;

/**
 * Syncs `data-theme="day" | "night"` on <html> and updates the mobile browser
 * `theme-color` meta tag automatically based on user preference and local time.
 */
export function useThemeSync(): 'day' | 'night' {
  const now = useNow();
  const pref = useAppStore((s) => s.themePreference);
  const resolved: 'day' | 'night' =
    pref === 'auto' ? (isNightHours(now) ? 'night' : 'day') : pref;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.content = THEME_COLORS[resolved];
    }
  }, [resolved]);

  return resolved;
}
