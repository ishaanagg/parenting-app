import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { useAppStore } from './state/useAppStore';

describe('App full-journey integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 10, 26, 14, 0)); // Deterministic 2:00 PM baseline
    useAppStore.getState().resetProfile();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows 3 AM emergency SOS directly from onboarding before DOB is entered', () => {
    render(<App />);
    expect(screen.getByText(/Calm, grounded parenting/i)).toBeInTheDocument();

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

  it('completes onboarding -> Today -> By Age -> How-To -> FrameworkSheet -> Settings -> Calm/3 AM pill', async () => {
    render(<App />);

    // 1. Onboarding: pick 9-12 Months stage (verify toddler 2-3 Years stage exists)
    expect(screen.getByRole('button', { name: /2–3 Years/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /9–12 Months/i }));
    expect(screen.getByRole('heading', { name: /Mobility & Separation/i })).toBeInTheDocument();

    // Both Kid & Marriage daily cards render on Today
    expect(screen.getByRole('region', { name: /Today's Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /For You and Your Marriage/i })).toBeInTheDocument();

    // 2. Open Settings, personalize names & switch to Day / Night theme
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

    // Personalized header + utility pill shows parent + baby name
    expect(screen.getByText(/Ishaan/i)).toBeInTheDocument();
    expect(screen.getByText(/Aarav · 9–12 Months/i)).toBeInTheDocument();

    // 3. Navigate to By Age cheat sheet and verify 9-12m stage overview renders
    fireEvent.click(screen.getByRole('button', { name: /^By Age$/i }));
    expect(screen.getByRole('heading', { name: /^By Age$/i })).toBeInTheDocument();
    expect(screen.getByText(/Fast cruisers, big opinions/i)).toBeInTheDocument();

    // 4. Navigate to How-To, filter by Tantrums & "No!", open plain-English Framework guide
    fireEvent.click(screen.getByRole('button', { name: /^How-To$/i }));
    expect(screen.getByRole('heading', { name: /^How-To$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Tantrums & "No!"$/i }));
    expect(screen.getByText(/Below Eye Level \+ 5-Second Validation/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Sturdy Boundaries/i })[0]!);
    expect(
      screen.getByRole('dialog', { name: /Sturdy Boundaries, Cycle-Breaking & Repair/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Good Inside/i)).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    // 4b. Navigate to Parents tab and verify Weekly Check-In, House Rules, and Personal Time
    fireEvent.click(screen.getByRole('button', { name: /^Parents$/i }));
    expect(screen.getByRole('heading', { name: /^Parents$/i })).toBeInTheDocument();
    expect(screen.getByText(/5-Min Weekly Check-In/i)).toBeInTheDocument();
    expect(screen.getByText(/Our House Rules/i)).toBeInTheDocument();
    expect(screen.getByText(/This Week’s Personal Time/i)).toBeInTheDocument();

    // 5. Open Calm / 3 AM support overlay from the persistent top header pill and bridge to How-To soothing holds
    fireEvent.click(
      screen.getByRole('button', { name: /Calm timer and reset|3 AM calm support and timer/i }),
    );
    expect(screen.getByRole('dialog', { name: /Take one slow breath/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Baby is crying \/ 3 AM wake-up/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /Still crying\? See step-by-step soothing holds/i }),
    );
    expect(screen.getByRole('heading', { name: /^How-To$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crying & Gas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
