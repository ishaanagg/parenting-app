import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { MomentsView } from './MomentsView';

describe('MomentsView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('defaults to 3 AM filter during night hours and links La Pause card to SOS', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 2, 30)); // 2:30 AM
    useAppStore.getState().completeOnboardingWithStage('0-6w');

    const onOpenSos = vi.fn();
    render(<MomentsView onOpenSos={onOpenSos} />);

    expect(screen.getByRole('button', { name: '3 AM' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: 'Boundaries' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open La Pause Timer/i }));
    expect(onOpenSos).toHaveBeenCalledWith('baby');
  });

  it('shows Boundaries filter for 9-12m and triggers FrameworkSheet callback', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 14, 0)); // 2:00 PM
    useAppStore.getState().completeOnboardingWithStage('9-12m');

    const onOpenFramework = vi.fn();
    render(<MomentsView onOpenFramework={onOpenFramework} />);

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Boundaries' }));
    expect(screen.getByText(/Food on the floor means the meal is pausing/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Bringing Up Bébé' }));
    expect(onOpenFramework).toHaveBeenCalledWith('le-cadre');
  });
});
