import { useEffect, useState } from 'react';

/**
 * Returns a `Date` that refreshes on an interval and whenever the app returns
 * to the foreground, so day keys, night tone and baby age never go stale when
 * the PWA is left open overnight.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    const id = window.setInterval(tick, intervalMs);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', tick);
    };
  }, [intervalMs]);

  return now;
}
