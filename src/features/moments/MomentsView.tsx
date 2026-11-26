import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { WISDOM_CARDS } from '../../content/wisdom';
import { filterWisdomCards, isNightHours } from '../../domain/stageEngine';
import type { BookFramework, MomentTag } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
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
  const babyName = useAppStore((s) => s.babyName);
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
    <div className="animate-calm-in space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-muted">Just-In-Time Wisdom</p>
          <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-ink">
            Moments
          </h1>
        </div>
        {onOpenStagePicker && (
          <button
            type="button"
            onClick={onOpenStagePicker}
            aria-label={`Settings and baby stage: ${activeStage.label}`}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-surface/90 px-3.5 py-2 text-xs font-medium text-amber transition active:border-amber"
          >
            <span>{babyName ? `${babyName} · ${activeStage.label}` : activeStage.label}</span>
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted" />
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
                  ? 'border-amber/70 bg-amber/15 text-amber'
                  : 'border-white/[0.06] bg-surface text-muted'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="rounded-3xl bg-surface p-6 text-sm text-muted ring-1 ring-white/[0.05]">
            Nothing for this moment in {activeStage.label} yet. Try “All” to see everything for your
            baby’s stage.
          </div>
        ) : (
          cards.map((card) => (
            <article
              key={card.id}
              className="space-y-3.5 rounded-3xl bg-surface p-6 ring-1 ring-white/[0.05]"
            >
              <button
                type="button"
                onClick={() => onOpenFramework?.(card.framework)}
                className="-my-2 inline-flex min-h-[44px] items-center"
              >
                <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-amber">
                  {FRAMEWORK_LABELS[card.framework]}
                </span>
              </button>

              <h2 className="font-serif text-xl leading-snug font-normal text-ink">
                {card.title}
              </h2>

              {/* Action first, clean left-accent bar instead of a nested box */}
              <div className="space-y-2.5 border-l-2 border-sage/60 pl-3.5">
                <p className="text-[15px] leading-relaxed text-ink/95">
                  <span className="font-medium text-sage">Try now: </span>
                  {card.tryNow}
                </p>
                {card.action === 'la-pause' && onOpenSos && (
                  <button
                    type="button"
                    onClick={() => onOpenSos('baby')}
                    className="min-h-[44px] w-full rounded-xl border border-amber/40 bg-amber/15 px-3 text-xs font-semibold text-amber"
                  >
                    Open La Pause Timer →
                  </button>
                )}
              </div>

              <p className="text-sm leading-relaxed text-muted">{card.insight}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
