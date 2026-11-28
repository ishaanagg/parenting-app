import { BookOpen, X } from 'lucide-react';
import { FRAMEWORK_GUIDES } from '../../content/frameworks';
import type { BookFramework } from '../../domain/types';
import { useDialog } from './useDialog';
import { useSwipeDownDismiss } from './useSwipeDownDismiss';

interface FrameworkSheetProps {
  framework: BookFramework;
  onClose: () => void;
}

export function FrameworkSheet({ framework, onClose }: FrameworkSheetProps) {
  const guide = FRAMEWORK_GUIDES[framework];
  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const swipe = useSwipeDownDismiss(onClose, dialogRef);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="framework-guide-title"
        style={swipe.style}
        {...swipe.handlers}
        className="max-h-[90dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-5 pb-[max(2rem,env(safe-area-inset-bottom))] outline-none"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-amber">
              <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
              {guide.shortLabel}
            </p>
            <h2
              id="framework-guide-title"
              className="mt-1 font-serif text-xl leading-snug font-normal text-ink"
            >
              {guide.themeTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close philosophy guide"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-elevated/80 text-muted transition active:scale-[0.95] active:text-ink after:absolute after:-inset-1"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <p className="border-l-2 border-amber/55 pl-3.5 font-serif text-[17px] leading-relaxed text-ink">
          {guide.coreIdea}
        </p>

        <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
          {guide.pillars.map((pillar) => (
            <li key={pillar} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
              <span>{pillar}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-1.5 border-t border-line pt-3.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Synthesized from
          </p>
          <ul className="space-y-1 text-xs leading-relaxed text-ink/90">
            {guide.sourceBooks.map((book) => (
              <li key={book.title}>
                <span className="font-medium text-ink">{book.title}</span>{' '}
                <span className="text-muted">— {book.author}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
