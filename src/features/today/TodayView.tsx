import { Check, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { PRACTICES } from '../../content/practices';
import { getParentDayKey, isNightHours, pickDailyPractice } from '../../domain/stageEngine';
import type { ParentMood } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';

interface TodayViewProps {
  onOpenStagePicker: () => void;
  onOpenSos: (initialPath?: 'baby' | 'parent') => void;
}

/** Stable empty reference: selectors must never return a fresh [] (infinite re-render). */
const EMPTY_IDS: readonly string[] = Object.freeze([]);

const MOOD_OPTIONS: {
  id: ParentMood;
  label: string;
  response: string;
  suggestSos?: boolean;
}[] = [
  { id: 'steady', label: 'Steady', response: 'Notice what’s working today—even small calm moments count.' },
  { id: 'tired', label: 'Tired', response: 'Lower the bar today. Togetherness on the floor counts as enough.' },
  {
    id: 'touched-out',
    label: 'Touched-out',
    response: 'It’s okay to need physical space. A 2-minute safe crib pause is healthy.',
    suggestSos: true,
  },
  {
    id: 'triggered',
    label: 'Triggered',
    response: 'Your nervous system is loud right now. Pause before reacting—you’re safe.',
    suggestSos: true,
  },
];

export function TodayView({ onOpenStagePicker, onOpenSos }: TodayViewProps) {
  const now = useNow();
  const { activeStage, ageInWeeks, isBrowsing, isBeyondContent } = useActiveStage();
  const dateKey = getParentDayKey(now);
  const night = isNightHours(now);

  const practicedToday = useAppStore((s) => s.practicedByDate[dateKey]) ?? EMPTY_IDS;
  const anotherCount = useAppStore((s) => s.anotherCountByDate[dateKey] ?? 0);
  const mood = useAppStore((s) => s.moodByDate[dateKey] ?? null);
  const markPracticed = useAppStore((s) => s.markPracticed);
  const showAnotherPractice = useAppStore((s) => s.showAnotherPractice);
  const setMood = useAppStore((s) => s.setMood);

  const practice = pickDailyPractice({
    stageId: activeStage.id,
    practices: PRACTICES,
    dateKey,
    offset: anotherCount,
  });

  const isPracticed = practice ? practicedToday.includes(practice.id) : false;
  const practicedAnother = !isPracticed && practicedToday.length > 0;
  const activeMoodOption = MOOD_OPTIONS.find((m) => m.id === mood);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {night ? 'Quiet Night' : 'Today'}
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-ink">{activeStage.subtitle}</h1>
          <p className="mt-1 text-xs leading-relaxed text-muted">{activeStage.focusSummary}</p>
          {isBeyondContent && (
            <p className="mt-1 text-[11px] text-sage">
              Content currently covers up to 12 months—more stages coming.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenStagePicker}
          aria-label={`Baby stage: ${activeStage.label}. Change stage`}
          className="min-h-[44px] shrink-0 rounded-full border border-line bg-surface px-3 py-2 text-right text-xs transition active:border-amber"
        >
          <span className="block font-medium text-amber">{activeStage.label}</span>
          {isBrowsing ? (
            <span className="block text-[11px] text-muted">Browsing · tap to return</span>
          ) : (
            ageInWeeks !== null && (
              <span className="block text-[11px] text-muted">Week {ageInWeeks}</span>
            )
          )}
        </button>
      </header>

      {practice && (
        <section
          aria-label="Today's Practice"
          className="space-y-4 rounded-2xl border border-line bg-surface p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber">
              <Sparkles className="h-3.5 w-3.5" />
              Today’s Practice
            </span>
            <span className="rounded-full bg-elevated px-2.5 py-0.5 text-right text-[11px] text-muted">
              {FRAMEWORK_LABELS[practice.framework]}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold leading-snug text-ink">{practice.title}</h2>
            <p className="text-sm leading-relaxed text-ink/90">{practice.prompt}</p>
            {practice.safetyNote && (
              <p className="flex gap-2 rounded-xl border border-sage/30 p-3 text-xs leading-relaxed text-ink/90">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
                <span>{practice.safetyNote}</span>
              </p>
            )}
            <p className="rounded-xl bg-canvas p-3 text-xs leading-relaxed text-muted">
              {practice.whyItWorks}
            </p>
          </div>

          {practicedAnother && (
            <p className="text-xs text-sage">✓ You already practiced one today. This one’s a bonus.</p>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => markPracticed(practice.id, dateKey)}
              aria-pressed={isPracticed}
              className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.99] ${
                isPracticed
                  ? 'border border-sage/40 bg-sage/15 text-sage'
                  : 'bg-amber text-canvas'
              }`}
            >
              <Check className="h-4 w-4" />
              {isPracticed ? 'Practiced today' : 'Mark practiced'}
            </button>

            <button
              type="button"
              onClick={() => showAnotherPractice(dateKey)}
              aria-label="Show another practice"
              className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated px-4 text-xs font-medium text-muted transition active:border-amber active:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Another
            </button>
          </div>
        </section>
      )}

      <section
        aria-label="Parent Check-In"
        className="space-y-3 rounded-2xl border border-line bg-surface p-5"
      >
        <h2 className="text-sm font-medium text-ink">How are you holding up right now?</h2>

        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((option) => {
            const selected = mood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMood(option.id, dateKey)}
                className={`min-h-[48px] rounded-xl border px-3 text-sm font-medium transition active:scale-[0.99] ${
                  selected
                    ? 'border-amber bg-amber/15 text-amber'
                    : 'border-line bg-canvas text-muted'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {activeMoodOption && (
          <div className="space-y-2.5 rounded-xl bg-canvas p-3.5" aria-live="polite">
            <p className="text-xs leading-relaxed text-ink/90">{activeMoodOption.response}</p>
            {activeMoodOption.suggestSos && (
              <button
                type="button"
                onClick={() => onOpenSos('parent')}
                className="min-h-[48px] w-full rounded-lg border border-amber/40 bg-amber/15 px-3 text-sm font-semibold text-amber transition active:scale-[0.99]"
              >
                Open Reset &amp; Repair →
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
