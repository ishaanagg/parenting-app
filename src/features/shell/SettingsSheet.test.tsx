import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBackupJson, useAppStore } from '../../state/useAppStore';
import { SettingsSheet } from './SettingsSheet';

describe('SettingsSheet', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  it('saves parent name, baby name, and DOB', () => {
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

    const state = useAppStore.getState();
    expect(state.parentName).toBe('Ishaan');
    expect(state.babyName).toBe('Aarav');
    expect(state.babyDob).toBe('2026-10-01');
  });

  it('restores a pasted backup JSON', () => {
    const backup = createBackupJson({
      hasCompletedOnboarding: true,
      parentName: 'Maya',
      babyName: 'Zara',
      babyDob: '2026-09-01',
      manualStageOverride: null,
      themePreference: 'night',
      practicedByDate: { '2026-11-25': ['rep-1'] },
      anotherCountByDate: {},
      moodByDate: {},
    });

    render(<SettingsSheet onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Paste backup/i }));
    fireEvent.change(screen.getByPlaceholderText(/Paste your copied Anchor backup/i), {
      target: { value: backup },
    });
    fireEvent.click(screen.getByRole('button', { name: /Restore pasted backup/i }));

    expect(screen.getByText(/Backup restored on this device/i)).toBeInTheDocument();
    expect(useAppStore.getState().parentName).toBe('Maya');
    expect(useAppStore.getState().babyName).toBe('Zara');
  });
});
