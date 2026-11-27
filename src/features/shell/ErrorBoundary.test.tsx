import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function Boom(): never {
  throw new Error('Test crash');
}

describe('ErrorBoundary', () => {
  it('renders calm fallback with safe-sleep and crisis guidance when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong on our side/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Anchor/i })).toBeInTheDocument();
    expect(screen.getByText(/clear crib or bassinet/i)).toBeInTheDocument();
    expect(screen.getByText(/Safe crib pause anytime/i)).toBeInTheDocument();

    spy.mockRestore();
  });
});
