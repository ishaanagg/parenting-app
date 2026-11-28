import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Bookmark, Check, Share2 } from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import type { BookFramework } from '../../domain/types';

/**
 * Standard horizontal filter chip (34px visual capsule + 44px touch target).
 * Follows Material 3 Filter Chip & iOS Capsule proportions so short labels ("All")
 * stay crisp horizontal pills rather than puffy circles, with zero font-weight shift.
 */
interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: ReactNode;
}

export function FilterChip({ active, children, className = '', ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`relative inline-flex h-[34px] min-w-[52px] shrink-0 snap-start items-center justify-center rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition active:scale-[0.98] after:absolute after:-inset-y-[5px] after:inset-x-0 ${
        active
          ? 'border-amber/70 bg-amber/15 text-amber'
          : 'border-line bg-surface text-muted active:text-ink'
      } ${className}`}
      {...rest}
    >
      <span className="ui-pill-label">{children}</span>
    </button>
  );
}

/**
 * Card top-right philosophy pill (26px visual height + 44px invisible touch hit area).
 * Keeps every card's top metadata bar on a uniform 26px horizontal centerline.
 */
interface PhilosophyTagButtonProps {
  framework: BookFramework;
  onOpenFramework?: (framework: BookFramework) => void;
}

export function PhilosophyTagButton({ framework, onOpenFramework }: PhilosophyTagButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenFramework?.(framework)}
      className="relative inline-flex h-[26px] shrink-0 items-center justify-center rounded-full border border-line/85 bg-elevated/85 px-2.5 text-[11px] font-medium whitespace-nowrap text-muted transition active:scale-[0.98] active:border-amber/50 active:text-ink after:absolute after:-inset-x-1 after:-inset-y-[9px]"
    >
      <span className="ui-pill-label">{FRAMEWORK_LABELS[framework]}</span>
    </button>
  );
}

/**
 * Matching 26px non-interactive guardrail badge for the left side of a card's top row.
 */
export function CardGuardrailBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[26px] items-center rounded-full border border-sage/35 bg-sage/10 px-2.5 text-[11px] font-medium whitespace-nowrap text-sage">
      <span className="ui-pill-label">{children}</span>
    </span>
  );
}

/**
 * Standardized 36x36px circular Bookmark button (with 44x44px touch area)
 * used in identical card footer positions across Today and How-To.
 */
interface BookmarkIconButtonProps {
  saved: boolean;
  label: string;
  onToggle: () => void;
}

export function BookmarkIconButton({ saved, label, onToggle }: BookmarkIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      onClick={onToggle}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-[0.95] after:absolute after:-inset-1 ${
        saved
          ? 'border-amber/55 bg-amber/15 text-amber'
          : 'border-line bg-canvas/75 text-muted active:text-ink'
      }`}
    >
      <Bookmark aria-hidden="true" className={`h-4 w-4 ${saved ? 'fill-amber text-amber' : ''}`} />
    </button>
  );
}

/**
 * Standardized 36x36px circular Share button (with 44x44px touch area)
 * used consistently across Today, How-To, By Age, and Parents.
 */
interface ShareIconButtonProps {
  copied: boolean;
  label: string;
  onShare: () => void;
}

export function ShareIconButton({ copied, label, onShare }: ShareIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onShare}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-[0.95] after:absolute after:-inset-1 ${
        copied
          ? 'border-sage/55 bg-sage/15 text-sage'
          : 'border-line bg-canvas/75 text-muted active:text-ink'
      }`}
    >
      {copied ? (
        <Check aria-hidden="true" className="h-4 w-4 text-sage" />
      ) : (
        <Share2 aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );
}
