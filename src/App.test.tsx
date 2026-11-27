import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { useAppStore } from './state/useAppStore';

describe('App full-journey integration', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    document.documentElement.removeAttribute('data-theme');
  });

  it('allows 3 AM emergency SOS directly from onboarding before DOB is entered', () => {
    render(<App />);
    expect(screen.getByText(/A steady breath at 3 AM/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Need help right now/i }));
    expect(screen.getByRole('dialog', { name: /Take one slow breath/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back to Anchor/i }));
    expect(screen.getByText(/When was your baby born/i)).toBeInTheDocument();
  });

  it('submits baby DOB during onboarding and computes stage automatically', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/When was your baby born/i), {
      target: { value: '2026-10-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Start with my baby’s stage/i }));
    expect(useAppStore.getState().babyDob).toBe('2026-10-01');
    expect(screen.getByRole('button', { name: /Settings and baby stage/i })).toBeInTheDocument();
  });

  it('completes onboarding -> Today -> Moments -> FrameworkSheet -> Settings Day/Night -> SOS', async () => {
    render(<App />);

    // 1. Onboarding: pick 9-12 Months stage
    fireEvent.click(screen.getByRole('button', { name: /9–12 Months/i }));
    expect(screen.getByRole('heading', { name: /Early Autonomy/i })).toBeInTheDocument();

    // 2. Open Settings, personalize names & switch to Day theme
    fireEvent.click(screen.getByRole('button', { name: /Settings and baby stage/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /Settings & Backup/i })).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/Your name/i), { target: { value: 'Ishaan' } });
    fireEvent.change(screen.getByLabelText(/Baby’s name/i), { target: { value: 'Aarav' } });
    fireEvent.click(screen.getByRole('button', { name: /^Save$/i }));

    fireEvent.click(screen.getByRole('button', { name: /^Day$/i }));
    expect(document.documentElement.dataset.theme).toBe('day');

    fireEvent.click(screen.getByRole('button', { name: /^Night$/i }));
    expect(document.documentElement.dataset.theme).toBe('night');

    fireEvent.click(screen.getByRole('button', { name: /Close settings/i }));

    // Personalized header shows parent + baby name
    expect(screen.getByText(/Ishaan/i)).toBeInTheDocument();
    expect(screen.getByText('Aarav')).toBeInTheDocument();

    // 3. Navigate to Moments, see Boundaries chip for 9-12m, open Framework guide
    fireEvent.click(screen.getByRole('button', { name: /^Moments$/i }));
    expect(screen.getByRole('heading', { name: /^Moments$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Boundaries$/i }));
    expect(screen.getByText(/Validate the feeling, hold the boundary/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Philippa Perry/i })[0]!);
    expect(
      screen.getByRole('dialog', { name: /The Book You Wish Your Parents Had Read/i }),
    ).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    // 4. Open SOS from bottom nav
    fireEvent.click(screen.getByRole('button', { name: /^SOS$/i }));
    expect(screen.getByRole('dialog', { name: /Take one slow breath/i })).toBeInTheDocument();
  });
});
