import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { ByAgeView } from './ByAgeView';

describe('ByAgeView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  it('renders the active stage 5-card cheat sheet and allows peeking ahead and returning', () => {
    const onOpenFramework = vi.fn();
    render(<ByAgeView onOpenFramework={onOpenFramework} />);

    expect(screen.getByRole('heading', { name: 'By Age' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /0–6 Weeks · Now/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/Sleep & Daily Rhythm \(Possums Mode\)/i)).toBeInTheDocument();

    // Peek ahead to 3-6 Months (4m pivot)
    fireEvent.click(screen.getByRole('button', { name: /^3–6 Months$/i }));
    expect(screen.getByText(/The 4-Month Pivot/i)).toBeInTheDocument();
    expect(screen.getByText(/Previewing/i)).toBeInTheDocument();

    // Peek ahead to 2-3 Years
    fireEvent.click(screen.getByRole('button', { name: /^2–3 Years$/i }));
    expect(screen.getByText(/Feelings are data, not directives/i)).toBeInTheDocument();

    // Return to current stage
    fireEvent.click(screen.getByRole('button', { name: /Back to 0–6 Weeks/i }));
    expect(screen.queryByText(/Previewing/i)).not.toBeInTheDocument();

    // Open philosophy guide pill
    fireEvent.click(screen.getAllByRole('button', { name: /Calm Baby Biology/i })[0]!);
    expect(onOpenFramework).toHaveBeenCalledWith('possums-data');
  });

  it('copies the full stage cheat sheet when sharing without Web Share API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<ByAgeView />);
    fireEvent.click(screen.getByRole('button', { name: /Share 0–6 Weeks cheat sheet/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0]?.[0]).toContain('0–6 Weeks (Fourth Trimester)');
  });
});
