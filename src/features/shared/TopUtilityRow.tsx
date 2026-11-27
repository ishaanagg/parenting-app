import { LifeBuoy, Moon, SlidersHorizontal } from 'lucide-react';
import { isNightHours } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';
import { useActiveStage } from './useActiveStage';
import { useNow } from './useNow';

interface TopUtilityRowProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
}

export function TopUtilityRow({ onOpenStagePicker, onOpenSos }: TopUtilityRowProps) {
  const now = useNow();
  const night = isNightHours(now);
  const { activeStage, ageInWeeks, isBrowsing } = useActiveStage();
  const babyName = useAppStore((s) => s.babyName);

  if (!onOpenStagePicker && !onOpenSos) return null;

  return (
    <div className="flex items-center justify-between gap-2.5">
      {onOpenStagePicker ? (
        <button
          type="button"
          onClick={onOpenStagePicker}
          aria-label={`Settings and baby stage: ${activeStage.label}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-1.5 text-left text-xs transition active:border-amber"
        >
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted" />
          <span>
            <span className="font-medium text-amber">
              {babyName ? `${babyName} · ${activeStage.label}` : activeStage.label}
            </span>
            {isBrowsing ? (
              <span className="ml-1.5 text-muted">· Browsing · return</span>
            ) : ageInWeeks !== null && !babyName ? (
              <span className="ml-1.5 text-muted">· Week {ageInWeeks}</span>
            ) : null}
          </span>
        </button>
      ) : (
        <span />
      )}

      {onOpenSos && (
        <button
          type="button"
          onClick={() => onOpenSos()}
          aria-label={night ? '3 AM calm support and timer' : 'Calm timer and reset'}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 px-3.5 text-xs font-semibold text-amber transition active:scale-[0.98]"
        >
          {night ? (
            <Moon aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <LifeBuoy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          <span>{night ? '3 AM' : 'Calm'}</span>
        </button>
      )}
    </div>
  );
}
