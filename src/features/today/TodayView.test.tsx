import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { TodayView } from './TodayView';

const getPracticeTitle = () =>
  screen.getByRole('region', { name: /Today's Practice/i }).querySelector('h2')!.textContent;

describe('TodayView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  it('renders on a fresh day without crashing and supports undoable practiced toggle', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    expect(screen.getByText(/How are you holding up/i)).toBeInTheDocument();

    // Expand "Why this works"
    fireEvent.click(screen.getByRole('button', { name: /Why this works/i }));
    expect(screen.getByRole('button', { name: /Why this works/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.click(screen.getByText(/Mark practiced/i));
    expect(screen.getByText(/Practiced today/i)).toBeInTheDocument();
    expect(screen.getByText(/1 of 5 fourth trimester practices tried recently/i)).toBeInTheDocument();

    // Tapping again undoes accidental tap
    fireEvent.click(screen.getByText(/Practiced today/i));
    expect(screen.getByText(/Mark practiced/i)).toBeInTheDocument();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('"Another" always rotates and keeps the practiced acknowledgement', () => {
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    const first = getPracticeTitle();

    // Expand "Why this works"
    fireEvent.click(screen.getByRole('button', { name: /Why this works/i }));
    expect(screen.getByRole('button', { name: /Why this works/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.click(screen.getByText(/Mark practiced/i));
    const another = screen.getByRole('button', { name: /Show another practice/i });
    fireEvent.click(another);
    const second = getPracticeTitle();
    expect(second).not.toBe(first);
    expect(screen.getByText(/already practiced one today/i)).toBeInTheDocument();

    let previous = second;
    for (let i = 0; i < 6; i++) {
      fireEvent.click(another);
      const current = getPracticeTitle();
      expect(current).not.toBe(previous);
      previous = current;
    }
  });

  it('offers Reset & Repair when the parent is triggered', () => {
    const onOpenSos = vi.fn();
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={onOpenSos} />);
    fireEvent.click(screen.getByRole('button', { name: 'Triggered' }));
    fireEvent.click(screen.getByText(/Open Reset & Repair/i));
    expect(onOpenSos).toHaveBeenCalledWith('parent');
  });

  it('shows a browsing indicator when the manual stage differs from DOB stage', () => {
    useAppStore.getState().setBabyDob('2026-01-01');
    useAppStore.getState().setManualStage('0-6w');
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    expect(screen.getByText(/Browsing · return/i)).toBeInTheDocument();
  });
});
