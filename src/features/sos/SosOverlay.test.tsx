import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { SosOverlay } from './SosOverlay';

describe('SosOverlay', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows both distress paths and compact expandable safety bar', () => {
    render(<SosOverlay onClose={vi.fn()} />);
    expect(screen.getByText(/Baby is crying \/ 3 AM wake-up/i)).toBeInTheDocument();
    expect(screen.getByText(/I’m overwhelmed \/ triggered/i)).toBeInTheDocument();
    expect(screen.getByText(/Safe crib pause anytime/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Safe crib pause anytime/i));
    expect(
      screen.getByText(/Anchor offers calm parenting support, not medical advice/i),
    ).toBeInTheDocument();
  });

  it('parent path shows live breathing pacer, safe sleep, and stepped tabs', () => {
    render(<SosOverlay initialPath="parent" onClose={vi.fn()} />);
    expect(screen.getByText(/Breathe in/i)).toBeInTheDocument();
    expect(screen.getByText(/clear crib or bassinet/i)).toBeInTheDocument();

    // Repair scripts shown by default
    expect(screen.getByText(/I got really overwhelmed just now/i)).toBeInTheDocument();

    // Switch to Trigger check
    fireEvent.click(screen.getByRole('button', { name: 'Trigger check' }));
    expect(screen.getByText(/Once you’ve taken two slow breaths/i)).toBeInTheDocument();

    // Switch to Crisis help
    fireEvent.click(screen.getByRole('button', { name: 'Crisis help' }));
    expect(screen.getByText(/Never shake a baby/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Postpartum Support International/i })).toHaveAttribute(
      'href',
      'tel:18009444773',
    );
  });

  it('La Pause timer counts down, shows post-pause guide, and restarts cleanly', () => {
    vi.useFakeTimers();
    render(<SosOverlay initialPath="baby" onClose={vi.fn()} />);
    expect(screen.getByText(/only for grunts and stirring/i)).toBeInTheDocument();
    expect(screen.getByText('1:00')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Start La Pause/i));
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(screen.getByText('0:30')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(31_000);
    });
    expect(screen.getByText(/Pause complete\. Listen for 10 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Start La Pause/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Start La Pause/i));
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<SosOverlay onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
