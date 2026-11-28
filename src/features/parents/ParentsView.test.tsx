import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../../state/useAppStore';
import { ParentsView } from './ParentsView';

describe('ParentsView', () => {
  beforeEach(() => {
    useAppStore.getState().resetProfile();
    useAppStore.getState().completeOnboardingWithStage('18-24m');
    useAppStore.getState().setParentName('Ishaan');
    useAppStore.getState().setPartnerName('Priya');
  });

  it('cycles weekly couple check-in prompts and toggles weekly completion cleanly', () => {
    render(<ParentsView />);

    expect(screen.getByRole('heading', { name: 'Parents' })).toBeInTheDocument();
    expect(screen.getByText(/1\/5/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next check-in prompt/i }));
    expect(screen.getByText(/2\/5/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Mark checked in/i }));
    expect(screen.getByRole('button', { name: /Checked in this week/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('pins preset & custom house rules and shares the united-front list', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<ParentsView />);

    // Pin a preset rule — unpinned presets now collapse cleanly inside <details>
    fireEvent.click(screen.getByRole('button', { name: /Code Yellow/i }));
    expect(screen.getByText(/Add or browse suggested rules/i)).toBeInTheDocument();

    // Open disclosure and add a custom rule
    fireEvent.click(screen.getByText(/Add or browse suggested rules/i));
    fireEvent.change(screen.getByLabelText(/Add your own house rule/i), {
      target: { value: 'Books before lights out' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(screen.getByText('Books before lights out')).toBeInTheDocument();

    // Share rules
    fireEvent.click(screen.getByRole('button', { name: /Share our house rules/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0]?.[0]).toContain('Code Yellow');
    expect(writeText.mock.calls[0]?.[0]).toContain('Books before lights out');

    // Remove custom rule
    fireEvent.click(screen.getByRole('button', { name: /Remove custom rule Books before lights out/i }));
    expect(screen.queryByText('Books before lights out')).not.toBeInTheDocument();
  });

  it('tracks weekly Personal Time chips independently for both partners', () => {
    render(<ParentsView />);

    const selfWorkout = screen.getByRole('button', { name: 'Workout / Run for Ishaan' });
    const spouseHobby = screen.getByRole('button', { name: 'Hobby / Build for Priya' });

    fireEvent.click(selfWorkout);
    fireEvent.click(spouseHobby);

    expect(selfWorkout).toHaveAttribute('aria-pressed', 'true');
    expect(spouseHobby).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Workout / Run for Priya' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('offers 1-tap Add names link when partner name has not been set yet', () => {
    useAppStore.getState().setPartnerName('');
    const onOpenStagePicker = vi.fn();
    render(<ParentsView onOpenStagePicker={onOpenStagePicker} />);

    fireEvent.click(screen.getByRole('button', { name: /Add names/i }));
    expect(onOpenStagePicker).toHaveBeenCalledTimes(1);
  });
});
