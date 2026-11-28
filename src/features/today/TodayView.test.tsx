import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 10, 26, 14, 0)); // Deterministic 2:00 PM baseline
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('0-6w');
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('rotates kid and marriage cards independently from 1/N when tapping "Another"', () => {
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);
    const firstKid = getKidPracticeTitle();
    const firstCouple = getCouplePracticeTitle();

    const anotherKid = screen.getByRole('button', { name: /Another kid practice/i });
    const anotherCouple = screen.getByRole('button', { name: /Another marriage habit/i });

    // Both counters always start at 1/N on first open of the day
    expect(anotherKid).toHaveTextContent(/1\/\d+/);
    expect(anotherCouple).toHaveTextContent(/1\/\d+/);

    fireEvent.click(screen.getByRole('button', { name: /Mark practiced/i }));
    fireEvent.click(anotherKid);

    const secondKid = getKidPracticeTitle();
    expect(secondKid).not.toBe(firstKid);
    expect(anotherKid).toHaveTextContent(/2\/\d+/);
    // Marriage card stays untouched at 1/N when rotating kid card
    expect(getCouplePracticeTitle()).toBe(firstCouple);
    expect(anotherCouple).toHaveTextContent(/1\/\d+/);
    expect(screen.getByText(/already did one today/i)).toBeInTheDocument();

    // Rotate marriage card independently -> 2/N
    fireEvent.click(anotherCouple);
    expect(getCouplePracticeTitle()).not.toBe(firstCouple);
    expect(anotherCouple).toHaveTextContent(/2\/\d+/);
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

  it('auto-opens the 60-second After-Work Reset during 5:30 PM transition hours', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 17, 30)); // 5:30 PM
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);

    const resetSection = screen.getByRole('region', { name: /After-Work Reset/i });
    expect(resetSection.querySelector('details')).toHaveAttribute('open');
    fireEvent.click(screen.getByRole('button', { name: /Start 2 Physiological Sighs/i }));
    expect(screen.getByText(/Sigh 1\/2/i)).toBeInTheDocument();
  });

  it('tucks daytime cards behind 1 tap during deep night (2:30 AM) while keeping Night Companion primary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 26, 2, 30)); // 2:30 AM
    render(<TodayView onOpenStagePicker={vi.fn()} onOpenSos={vi.fn()} />);

    expect(screen.getByRole('region', { name: /Night Companion/i })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Today's Practice/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Show daytime practices/i }));
    expect(screen.getByRole('region', { name: /Today's Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /For You and Your Marriage/i })).toBeInTheDocument();
  });
});
