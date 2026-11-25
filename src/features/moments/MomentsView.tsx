import { useState } from 'react';
import { WISDOM_CARDS } from '../../content/wisdom';
import { filterWisdomCards } from '../../domain/stageEngine';
import { FRAMEWORK_LABELS, type MomentTag } from '../../domain/types';
import { useActiveStage } from '../../state/useActiveStage';

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
        <p className="text-xs uppercase tracking-wider text-[#B5A99F]">
          Just-In-Time Wisdom · {activeStage.label}
        </p>
        <h1 className="mt-0.5 text-xl font-semibold text-[#F4EFEA]">
          Moments
        </h1>
      </header>

      {/* Scrollable thumb-friendly filter chips */}
      <div
        role="tablist"
        aria-label="Filter wisdom by moment"
        className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {MOMENT_FILTERS.map((filter) => {
          const active = selectedMoment === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedMoment(filter.id)}
              className={`min-h-[40px] shrink-0 rounded-full border px-3.5 text-xs font-medium transition ${
                active
                  ? 'border-[#E09F67] bg-[#E09F67]/15 text-[#E09F67]'
                  : 'border-[#332A24] bg-[#1E1916] text-[#B5A99F]'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="rounded-2xl border border-[#332A24] bg-[#1E1916] p-5 text-sm text-[#B5A99F]">
            No cards for this filter in {activeStage.label} yet. Try “All” to see
            everything for your baby’s stage.
          </div>
        ) : (
          cards.map((card) => (
            <article
              key={card.id}
              className="space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#28211D] px-2.5 py-0.5 text-[11px] text-[#E09F67]">
                  {FRAMEWORK_LABELS[card.framework]}
                </span>
                <span className="text-[11px] text-[#B5A99F]">
                  {card.moments.map((m) => `#${m}`).join(' ')}
                </span>
              </div>

              <h2 className="text-base font-semibold text-[#F4EFEA]">
                {card.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#B5A99F]">
                {card.insight}
              </p>

              <div className="rounded-xl bg-[#14110F] p-3 text-xs leading-relaxed text-[#F4EFEA]/90">
                <span className="font-semibold text-[#8FA893]">Try now: </span>
                {card.tryNow}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
