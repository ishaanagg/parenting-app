import { useMemo, useState } from 'react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { WISDOM_CARDS } from '../../content/wisdom';
import { filterWisdomCards, isNightHours } from '../../domain/stageEngine';
import type { BookFramework, MomentTag } from '../../domain/types';
import { useActiveStage } from '../shared/useActiveStage';

interface MomentsViewProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent') => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

const BASE_FILTERS: { id: MomentTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: '3am', label: '3 AM' },
  { id: 'fussy', label: 'Fussy' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'repair', label: 'Repair' },
];

export function MomentsView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: MomentsViewProps) {
  const { activeStage } = useActiveStage();
  const [selectedMoment, setSelectedMoment] = useState<MomentTag | 'all'>(() =>
    isNightHours() ? '3am' : 'all',
  );

  const filters = useMemo(() => {
    const showBoundaries = activeStage.id === '6-9m' || activeStage.id === '9-12m';
    if (!showBoundaries) return BASE_FILTERS;
    return [
      ...BASE_FILTERS.slice(0, 5),
      { id: 'boundaries' as const, label: 'Boundaries' },
      ...BASE_FILTERS.slice(5),
    ];
  }, [activeStage.id]);

  const effectiveMoment =
    selectedMoment === 'boundaries' &&
    activeStage.id !== '6-9m' &&
    activeStage.id !== '9-12m'
      ? 'all'
      : selectedMoment;

  const cards = filterWisdomCards({
    stageId: activeStage.id,
    moment: effectiveMoment,
    cards: WISDOM_CARDS,
  });

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            Just-In-Time Wisdom
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-ink">Moments</h1>
        </div>
        {onOpenStagePicker && (
          <button
            type="button"
            onClick={onOpenStagePicker}
            aria-label={`Baby stage: ${activeStage.label}. Change stage`}
            className="min-h-[44px] shrink-0 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium text-amber transition active:border-amber"
          >
            {activeStage.label}
          </button>
        )}
      </header>

      <div
        role="group"
        aria-label="Filter wisdom by moment"
        className="no-scrollbar fade-right-mask -mx-5 flex gap-2 overflow-x-auto px-5 pr-10 pb-1"
      >
        {filters.map((filter) => {
          const active = effectiveMoment === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedMoment(filter.id)}
              className={`min-h-[44px] shrink-0 rounded-full border px-4 text-xs font-medium transition ${
                active
                  ? 'border-amber bg-amber/15 text-amber'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="rounded-2xl bg-surface p-5 text-sm text-muted ring-1 ring-white/[0.04]">
            Nothing for this moment in {activeStage.label} yet. Try “All” to see everything for your
            baby’s stage.
          </div>
        ) : (
          cards.map((card) => (
            <article
              key={card.id}
              className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-white/[0.04]"
            >
              <button
                type="button"
                onClick={() => onOpenFramework?.(card.framework)}
                className="-my-2 inline-flex min-h-[44px] items-center"
              >
                <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-amber underline decoration-amber/30 underline-offset-2">
                  {FRAMEWORK_LABELS[card.framework]}
                </span>
              </button>
              <h2 className="text-base font-semibold text-ink">{card.title}</h2>
              <p className="text-[15px] leading-relaxed text-muted">{card.insight}</p>
              <div className="space-y-2 rounded-xl bg-canvas p-3.5 text-sm leading-relaxed text-ink/95">
                <p>
                  <span className="font-semibold text-sage">Try now: </span>
                  {card.tryNow}
                </p>
                {card.action === 'la-pause' && onOpenSos && (
                  <button
                    type="button"
                    onClick={() => onOpenSos('baby')}
                    className="min-h-[44px] w-full rounded-lg border border-amber/40 bg-amber/15 px-3 text-xs font-semibold text-amber"
                  >
                    Open La Pause Timer →
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
