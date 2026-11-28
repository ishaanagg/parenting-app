import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PRACTICES } from '../../content/practices';
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

    expect(screen.getByRole('button', { name: /3 AM calm support and timer/i })).toHaveTextContent(
      '3 AM',
    );
    expect(screen.getByRole('button', { name: 'Bedtime & Sleep' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByRole('button', { name: 'Hitting & Throwing' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open La Pause Timer/i }));
    expect(onOpenSos).toHaveBeenCalledWith('baby', true);
  });

  it('shows daytime Calm pill, toddler situation filters, 5% badge, unified Saved bookmarks, and spouse share', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 14, 0)); // 2:00 PM
    useAppStore.getState().completeOnboardingWithStage('18-24m');

    // Pre-bookmark a Today practice to verify unified Saved memory
    const samplePractice = PRACTICES[0]!;
    useAppStore.getState().toggleSavedCard(samplePractice.id);

    const onOpenFramework = vi.fn();
    const onOpenSos = vi.fn();
    render(<HowToView onOpenSos={onOpenSos} onOpenFramework={onOpenFramework} />);

    expect(screen.getByRole('button', { name: /Calm timer and reset/i })).toHaveTextContent('Calm');

    // Filter to Tantrums & "No!"
    fireEvent.click(screen.getByRole('button', { name: 'Tantrums & "No!"' }));
    expect(screen.getByText(/Below Eye Level \+ 5-Second Validation/i)).toBeInTheDocument();
    expect(screen.getByText(/5% Emergency Only/i)).toBeInTheDocument();

    // Bookmark a How-To guide -> Saved (2) shows both Today practice + How-To guide
    fireEvent.click(
      screen.getByRole('button', { name: /Bookmark Below Eye Level \+ 5-Second Validation/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Saved \(2\)/i }));
    expect(screen.getByText(samplePractice.title)).toBeInTheDocument();
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

  it('filters instantly via search input and offers 1-tap cross-stage fallback', () => {
    useAppStore.getState().completeOnboardingWithStage('0-6w');
    render(<HowToView />);

    const searchInput = screen.getByRole('searchbox', { name: /Search How-To guides/i });
    fireEvent.change(searchInput, { target: { value: 'tiger' } });
    expect(screen.getByText(/Tiger in the Tree/i)).toBeInTheDocument();

    // Search a toddler-specific term ("banana") while in 0-6w stage
    fireEvent.change(searchInput, { target: { value: 'banana' } });
    expect(screen.getByText(/No How-To guides matching/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Show 1 match from other ages/i }));
    expect(screen.getByText(/Fantasy Wish \/ Playful Tension-Breaker/i)).toBeInTheDocument();

    // Clear search
    fireEvent.click(screen.getByRole('button', { name: /Clear search/i }));
    expect(searchInput).toHaveValue('');
  });
});
