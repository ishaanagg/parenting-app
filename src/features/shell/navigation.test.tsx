import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { AppShell } from './AppShell';

vi.mock('../../state/dailyBackup', () => ({
  listDailyBackups: vi.fn().mockResolvedValue([]),
  upsertTodayBackup: vi.fn().mockResolvedValue(undefined),
}));

describe('Native mobile navigation (Android Back & swipe-down)', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
    window.history.replaceState(null, '');
  });

  it('closes overlays and returns to Today on popstate (Android Back gesture)', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<AppShell />);

    // Switch to How-To tab (pushes history & scrolls to top)
    fireEvent.click(screen.getByRole('button', { name: /How-To/i }));
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0 });
    expect(window.history.state).toEqual({ anchorNav: true, tab: 'how-to', overlay: null });

    // Open Settings overlay (pushes history)
    fireEvent.click(screen.getByRole('button', { name: /Settings and baby stage/i }));
    expect(screen.getByRole('dialog', { name: /Settings & Backup/i })).toBeInTheDocument();
    expect(window.history.state).toEqual({ anchorNav: true, tab: 'how-to', overlay: 'settings' });

    // Simulate Android Back -> closes Settings, stays on How-To
    act(() => {
      window.dispatchEvent(
        new PopStateEvent('popstate', {
          state: { anchorNav: true, tab: 'how-to', overlay: null },
        }),
      );
    });
    expect(screen.queryByRole('dialog', { name: /Settings & Backup/i })).not.toBeInTheDocument();

    // Simulate Android Back again -> returns to Today tab
    act(() => {
      window.dispatchEvent(
        new PopStateEvent('popstate', {
          state: { anchorNav: true, tab: 'today', overlay: null },
        }),
      );
    });
    expect(screen.getByRole('button', { name: /Today/i })).toHaveAttribute('aria-current', 'page');

    scrollSpy.mockRestore();
  });

  it('dismisses SettingsSheet on downward swipe past threshold', () => {
    render(<AppShell />);
    fireEvent.click(screen.getByRole('button', { name: /Settings and baby stage/i }));
    const dialog = screen.getByRole('dialog', { name: /Settings & Backup/i });

    fireEvent.touchStart(dialog, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(dialog, { touches: [{ clientY: 220 }] });
    fireEvent.touchEnd(dialog);

    expect(screen.queryByRole('dialog', { name: /Settings & Backup/i })).not.toBeInTheDocument();
  });
});
