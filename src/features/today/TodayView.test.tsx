import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { TodayView } from './TodayView';

const getKidPracticeTitle = () =>
  screen.getByRole('region', { name: /Today's Practice/i }).querySelector('h2')!.textContent;

const getCouplePracticeTitle = () =>
  screen
    .getByRole('region', { name: /For You and Your Marriage/i })
    .querySelector('h2')!.textContent;

describe('TodayView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  it('renders both daily cards (Kid + Marriage) and supports undoable toggles, bookmarks, and share', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onOpenFramework = vi.fn();
    render(
      <TodayView
        onOpenStagePicker={vi.fn()}
        onOpenSos={vi.fn()}
        onOpenFramework={onOpenFramework}
      />,
    );

    expect(screen.getByRole('region', { name: /Today's Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /For You and Your Marriage/i })).toBeInTheDocument();
    expect(screen.getByText(/How are you holding up/i)).toBeInTheDocument();

    // Disambiguated "Why this works" disclosures
    const kidWhy = screen.getByRole('button', { name: /Why this works for your child/i });
    fireEvent.click(kidWhy);
    expect(kidWhy).toHaveAttribute('aria-expanded', 'true');

    const coupleWhy = screen.getByRole('button', { name: /Why this works for your marriage/i });
    fireEvent.click(coupleWhy);
    expect(coupleWhy).toHaveAttribute('aria-expanded', 'true');

    // Bookmark & Share kid practice
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    fireEvent.click(screen.getByRole('button', { name: /Bookmark practice/i }));
    expect(useAppStore.getState().savedCardIds.length).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: /Share practice/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    // Toggle kid card practiced + undo
    fireEvent.click(screen.getByRole('button', { name: /Mark practiced/i }));
    expect(screen.getByRole('button', { name: /Practiced today/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Practiced today/i }));
    expect(screen.getByRole('button', { name: /Mark practiced/i })).toBeInTheDocument();

    // Toggle marriage habit done + undo independently
    fireEvent.click(screen.getByRole('button', { name: /Mark done/i }));
    expect(screen.getByRole('button', { name: /Done today/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Done today/i }));
    expect(screen.getByRole('button', { name: /Mark done/i })).toBeInTheDocument();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('rotates kid and marriage cards independently when tapping "Another"', () => {
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    const firstKid = getKidPracticeTitle();
    const firstCouple = getCouplePracticeTitle();

    fireEvent.click(screen.getByRole('button', { name: /Mark practiced/i }));
    const anotherKid = screen.getByRole('button', { name: /Another kid practice/i });
    fireEvent.click(anotherKid);

    const secondKid = getKidPracticeTitle();
    expect(secondKid).not.toBe(firstKid);
    // Marriage card stays untouched when rotating kid card
    expect(getCouplePracticeTitle()).toBe(firstCouple);
    expect(screen.getByText(/already did one today/i)).toBeInTheDocument();

    // Rotate marriage card independently
    const anotherCouple = screen.getByRole('button', { name: /Another marriage habit/i });
    fireEvent.click(anotherCouple);
    expect(getCouplePracticeTitle()).not.toBe(firstCouple);
    expect(getKidPracticeTitle()).toBe(secondKid);
  });

  it('renders toddler 2–3y stage practices cleanly', () => {
    useAppStore.getState().setManualStage('2-3y');
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grit & Character');
    expect(getKidPracticeTitle()).toBeTruthy();
    expect(getCouplePracticeTitle()).toBeTruthy();
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
