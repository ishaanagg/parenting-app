import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SosOverlay } from './SosOverlay';

describe('SosOverlay', () => {
  it('renders both distress paths plus safe-sleep and pediatrician reminders', () => {
    render(<SosOverlay onClose={vi.fn()} />);

    expect(
      screen.getByText(/Baby is crying \/ 3 AM wake-up/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I’m overwhelmed \/ triggered/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Safe-Sleep Permission/i)).toBeInTheDocument();
    expect(screen.getByText(/contact your pediatrician/i)).toBeInTheDocument();
  });

  it('opens La Pause timer in baby path and repair scripts in parent path', () => {
    render(<SosOverlay onClose={vi.fn()} />);

    fireEvent.click(screen.getByText(/Baby is crying \/ 3 AM wake-up/i));
    expect(screen.getByText(/Start La Pause/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Switch path/i));
    fireEvent.click(screen.getByText(/I’m overwhelmed \/ triggered/i));
    expect(screen.getByText(/Your calm is the anchor/i)).toBeInTheDocument();
    expect(screen.getByText(/Rupture & Repair/i)).toBeInTheDocument();
  });
});
