import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SAFE_SLEEP_REMINDER, SOS_PINNED_LINE } from '../../content/sos';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last-resort calm fallback. Even if the UI breaks, the parent still sees the
 * safe-sleep and crisis guidance instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Anchor UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5 text-ink">
        <h1 className="text-xl font-semibold">Something went wrong on our side.</h1>
        <p className="text-sm text-muted">It’s not you. Reloading usually fixes it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[52px] rounded-xl bg-amber text-base font-semibold text-canvas"
        >
          Reload Anchor
        </button>
        <div className="space-y-1.5 rounded-xl border border-sage/30 bg-surface p-3 text-xs leading-relaxed">
          <p>{SAFE_SLEEP_REMINDER}</p>
          <p className="text-muted">{SOS_PINNED_LINE}</p>
        </div>
      </main>
    );
  }
}
