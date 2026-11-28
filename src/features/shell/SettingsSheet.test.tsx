import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBackupJson, useAppStore } from '../../state/useAppStore';
import { SettingsSheet } from './SettingsSheet';

vi.mock('../../state/dailyBackup', () => ({
  listDailyBackups: vi.fn().mockResolvedValue([]),
  upsertTodayBackup: vi.fn().mockResolvedValue(undefined),
}));

describe('SettingsSheet', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  it('saves parent name, baby name, DOB, and appearance preference', async () => {
    render(<SettingsSheet onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Your name/i), {
      target: { value: 'Ishaan' },
    });
    fireEvent.change(screen.getByLabelText(/Baby’s name/i), {
      target: { value: 'Aarav' },
    });
    fireEvent.change(screen.getByLabelText(/Baby’s birth date/i), {
      target: { value: '2026-10-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Day$/i }));

    await waitFor(() => {
      const state = useAppStore.getState();
      expect(state.parentName).toBe('Ishaan');
      expect(state.babyName).toBe('Aarav');
      expect(state.babyDob).toBe('2026-10-01');
      expect(state.themePreference).toBe('day');
    });
  });

  it('restores a pasted backup JSON', async () => {
    const backup = createBackupJson({
      hasCompletedOnboarding: true,
      parentName: 'Maya',
      partnerName: 'Dev',
      babyName: 'Zara',
      babyDob: '2026-09-01',
      manualStageOverride: null,
      themePreference: 'night',
      savedCardIds: [],
      practicedByDate: { '2026-11-25': ['rep-1'] },
      anotherCountByDate: {},
      coupleAnotherCountByDate: {},
      moodByDate: {},
      pinnedHouseRuleIds: ['rule-code-yellow'],
      customHouseRules: [],
      couplePromptOffset: 0,
      coupleCheckInByWeek: {},
      personalTimeByWeek: {},
    });

    render(<SettingsSheet onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Paste backup/i }));
    fireEvent.change(screen.getByPlaceholderText(/Paste your copied Anchor backup/i), {
      target: { value: backup },
    });
    fireEvent.click(screen.getByRole('button', { name: /Restore pasted backup/i }));

    await waitFor(() => {
      expect(screen.getByText(/Backup restored on this device/i)).toBeInTheDocument();
    });
    expect(useAppStore.getState().parentName).toBe('Maya');
    expect(useAppStore.getState().babyName).toBe('Zara');
  });
});
