import { useState } from 'react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { WISDOM_CARDS } from '../../content/wisdom';
import { filterWisdomCards } from '../../domain/stageEngine';
import type { MomentTag } from '../../domain/types';
import { useActiveStage } from '../shared/useActiveStage';

const MOMENT_FILTERS: { id: MomentTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: '3am', label: '3 AM' },
  { id: 'fussy', label: 'Fussy' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'repair', label: 'Repair' },
];

export function MomentsView() {
  const { activeStage } = useActiveStage();
  const [selectedMoment, setSelectedMoment] = useState<MomentTag | 'all'>('all');

  const cards = filterWisdomCards({
    stageId: activeStage.id,
    moment: selectedMoment,
    cards: WISDOM_CARDS,
  });

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted">
          Just-In-Time Wisdom · {activeStage.label}
        </p>
        <h1 className="mt-0.5 text-xl font-semibold text-ink">Moments</h1>
      </header>

      <div
        role="group"
        aria-label="Filter wisdom by moment"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1"
      >
        {MOMENT_FILTERS.map((filter) => {
          const active = selectedMoment === filter.id;
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
          <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
            Nothing for this moment in {activeStage.label} yet. Try “All” to see everything for your
            baby’s stage.
          </div>
        ) : (
          cards.map((card) => (
            <article key={card.id} className="space-y-3 rounded-2xl border border-line bg-surface p-5">
              <span className="inline-block rounded-full bg-elevated px-2.5 py-0.5 text-[11px] text-amber">
                {FRAMEWORK_LABELS[card.framework]}
              </span>
              <h2 className="text-base font-semibold text-ink">{card.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{card.insight}</p>
              <div className="rounded-xl bg-canvas p-3 text-xs leading-relaxed text-ink/90">
                <span className="font-semibold text-sage">Try now: </span>
                {card.tryNow}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
