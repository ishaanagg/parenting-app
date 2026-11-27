import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { HowToView } from './HowToView';

describe('HowToView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('defaults to Bedtime & Sleep at 2:30 AM, shows 3 AM pill, and links La Pause to timer', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 2, 30)); // 2:30 AM
    useAppStore.getState().completeOnboardingWithStage('0-6w');

    const onOpenSos = vi.fn();
    render(<HowToView onOpenStagePicker={vi.fn()} onOpenSos={onOpenSos} />);

    // Top pill shows "3 AM" at night
    expect(screen.getByRole('button', { name: /3 AM calm support and timer/i })).toHaveTextContent(
      '3 AM',
    );
    expect(screen.getByRole('button', { name: 'Bedtime & Sleep' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    // Toddler-only categories stay hidden for 0-6w newborns
    expect(screen.queryByRole('button', { name: 'Hitting & Throwing' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open La Pause Timer/i }));
    expect(onOpenSos).toHaveBeenCalledWith('baby', true);
  });

  it('shows daytime Calm pill, toddler situation filters, 5% badge, bookmark, and spouse share', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 14, 0)); // 2:00 PM
    useAppStore.getState().completeOnboardingWithStage('18-24m');

    const onOpenFramework = vi.fn();
    const onOpenSos = vi.fn();
    render(<HowToView onOpenSos={onOpenSos} onOpenFramework={onOpenFramework} />);

    // Top pill shows "Calm" during daytime
    expect(screen.getByRole('button', { name: /Calm timer and reset/i })).toHaveTextContent('Calm');

    // Filter to Tantrums & "No!"
    fireEvent.click(screen.getByRole('button', { name: 'Tantrums & "No!"' }));
    expect(screen.getByText(/Below Eye Level \+ 5-Second Validation/i)).toBeInTheDocument();
    expect(screen.getByText(/5% Emergency Only/i)).toBeInTheDocument();

    // Bookmark and filter by Saved
    fireEvent.click(
      screen.getByRole('button', { name: /Bookmark Below Eye Level \+ 5-Second Validation/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Saved \(1\)/i }));
    expect(screen.getByText(/Below Eye Level \+ 5-Second Validation/i)).toBeInTheDocument();

    // Share formats numbered steps + out-loud script
    vi.useRealTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Share Below Eye Level \+ 5-Second Validation/i }),
    );
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0]?.[0]).toContain('1. Crouch or sit BELOW their eye line');
    expect(writeText.mock.calls[0]?.[0]).toContain('Say out loud:');
  });
});
