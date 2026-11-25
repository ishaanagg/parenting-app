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
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-5 text-[#F4EFEA]">
        <h1 className="text-xl font-semibold">Something went wrong on our side.</h1>
        <p className="text-sm text-[#B5A99F]">It’s not you. Reloading usually fixes it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[52px] rounded-xl bg-[#E09F67] text-base font-semibold text-[#14110F]"
        >
          Reload Anchor
        </button>
        <div className="space-y-1.5 rounded-xl border border-[#8FA893]/30 bg-[#1E1916] p-3 text-xs leading-relaxed">
          <p>{SAFE_SLEEP_REMINDER}</p>
          <p className="text-[#B5A99F]">{SOS_PINNED_LINE}</p>
        </div>
      </main>
    );
  }
}
