import { BookOpen, X } from 'lucide-react';
import { FRAMEWORK_GUIDES } from '../../content/frameworks';
import type { BookFramework } from '../../domain/types';
import { useDialog } from './useDialog';

interface FrameworkSheetProps {
  framework: BookFramework;
  onClose: () => void;
}

export function FrameworkSheet({ framework, onClose }: FrameworkSheetProps) {
  const guide = FRAMEWORK_GUIDES[framework];
  const dialogRef = useDialog<HTMLDivElement>(onClose);

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
        className="w-full max-w-md space-y-4 rounded-t-3xl border-t border-line bg-surface p-5 pb-[max(2rem,env(safe-area-inset-bottom))] outline-none"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-amber">
              <BookOpen className="h-3.5 w-3.5" />
              Framework Guide
            </p>
            <h2 id="framework-guide-title" className="mt-0.5 text-lg font-semibold text-ink">
              {guide.bookTitle}
            </h2>
            <p className="text-xs text-muted">by {guide.author}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close framework guide"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-elevated text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="rounded-xl bg-canvas p-3.5 text-[15px] leading-relaxed text-ink/95">
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
      </div>
    </div>
  );
}
