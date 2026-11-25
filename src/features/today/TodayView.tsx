import { Check, RefreshCw, Sparkles } from 'lucide-react';
import { PRACTICES } from '../../content/practices';
import {
  getDateKey,
  isNightHours,
  pickDailyPractice,
} from '../../domain/stageEngine';
import { FRAMEWORK_LABELS, type ParentMood } from '../../domain/types';
import { useActiveStage } from '../../state/useActiveStage';
import { useAppStore } from '../../state/useAppStore';

interface TodayViewProps {
  onOpenStagePicker: () => void;
  onOpenSos: (initialPath?: 'baby' | 'parent') => void;
}

const MOOD_OPTIONS: {
  id: ParentMood;
  label: string;
  response: string;
  suggestSos?: boolean;
}[] = [
  {
    id: 'steady',
    label: 'Steady',
    response: 'Notice what’s working today—even small calm moments count.',
  },
  {
    id: 'tired',
    label: 'Tired',
    response: 'Lower the bar today. Togetherness on the floor counts as enough.',
  },
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
  const { activeStage, ageInWeeks } = useActiveStage();
  const dateKey = getDateKey();
  const night = isNightHours();

  const practicedToday = useAppStore(
    (s) => s.practicedByDate[dateKey] ?? [],
  );
  const skippedToday = useAppStore((s) => s.skippedByDate[dateKey] ?? []);
  const lastMood = useAppStore((s) => s.lastMood);
  const markPracticed = useAppStore((s) => s.markPracticed);
  const skipPracticeForToday = useAppStore((s) => s.skipPracticeForToday);
  const setMood = useAppStore((s) => s.setMood);

  const practice = pickDailyPractice({
    stageId: activeStage.id,
    practices: PRACTICES,
    dateKey,
    skippedIds: skippedToday,
  });

  const isPracticed = practice ? practicedToday.includes(practice.id) : false;
  const activeMoodOption = MOOD_OPTIONS.find((m) => m.id === lastMood);

  return (
    <div className="space-y-5">
      {/* Stage & Time-of-Day Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#B5A99F]">
            {night ? 'Quiet Night' : 'Today'}
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-[#F4EFEA]">
            {activeStage.subtitle}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#B5A99F]">
            {activeStage.focusSummary}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenStagePicker}
          className="shrink-0 rounded-full border border-[#332A24] bg-[#1E1916] px-3 py-2 text-right text-xs transition active:border-[#E09F67]"
        >
          <span className="block font-medium text-[#E09F67]">
            {activeStage.label}
          </span>
          {ageInWeeks !== null && (
            <span className="block text-[11px] text-[#B5A99F]">
              Week {ageInWeeks}
            </span>
          )}
        </button>
      </header>

      {/* Block 1: Today's Practice Rep */}
      {practice && (
        <section
          aria-label="Today's Practice"
          className="space-y-4 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E09F67]">
              <Sparkles className="h-3.5 w-3.5" />
              Today’s Practice
            </span>
            <span className="rounded-full bg-[#28211D] px-2.5 py-0.5 text-[11px] text-[#B5A99F]">
              {FRAMEWORK_LABELS[practice.framework]}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold leading-snug text-[#F4EFEA]">
              {practice.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#F4EFEA]/90">
              {practice.prompt}
            </p>
            <p className="rounded-xl bg-[#14110F] p-3 text-xs leading-relaxed text-[#B5A99F]">
              {practice.whyItWorks}
            </p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => markPracticed(practice.id, dateKey)}
              className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.99] ${
                isPracticed
                  ? 'border border-[#8FA893]/40 bg-[#8FA893]/15 text-[#8FA893]'
                  : 'bg-[#E09F67] text-[#14110F]'
              }`}
            >
              <Check className="h-4 w-4" />
              {isPracticed ? 'Practiced today' : 'Mark practiced'}
            </button>

            <button
              type="button"
              onClick={() => skipPracticeForToday(practice.id, dateKey)}
              aria-label="Show another practice"
              className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-[#332A24] bg-[#28211D] px-4 text-xs font-medium text-[#B5A99F] transition active:border-[#E09F67] active:text-[#F4EFEA]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Another
            </button>
          </div>
        </section>
      )}

      {/* Block 2: 1-Tap Parent Check-In */}
      <section
        aria-label="Parent Check-In"
        className="space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5"
      >
        <h2 className="text-sm font-medium text-[#F4EFEA]">
          How are you holding up right now?
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((option) => {
            const selected = lastMood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMood(option.id)}
                className={`min-h-[48px] rounded-xl border px-3 text-sm font-medium transition active:scale-[0.99] ${
                  selected
                    ? 'border-[#E09F67] bg-[#E09F67]/15 text-[#E09F67]'
                    : 'border-[#332A24] bg-[#14110F] text-[#B5A99F]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {activeMoodOption && (
          <div className="space-y-2.5 rounded-xl bg-[#14110F] p-3.5">
            <p className="text-xs leading-relaxed text-[#F4EFEA]/90">
              {activeMoodOption.response}
            </p>
            {activeMoodOption.suggestSos && (
              <button
                type="button"
                onClick={() => onOpenSos('parent')}
                className="min-h-[42px] w-full rounded-lg border border-[#E09F67]/40 bg-[#E09F67]/15 px-3 text-xs font-semibold text-[#E09F67] transition active:scale-[0.99]"
              >
                Open 60s Reset &amp; Repair →
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
