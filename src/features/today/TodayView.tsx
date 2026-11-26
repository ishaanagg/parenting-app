import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Moon,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { PRACTICES } from '../../content/practices';
import { getParentDayKey, isNightHours, pickDailyPractice } from '../../domain/stageEngine';
import type { BookFramework, ParentMood } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';
import { formatSeconds } from '../sos/SosOverlay';

interface TodayViewProps {
  onOpenStagePicker: () => void;
  onOpenSos: (initialPath?: 'baby' | 'parent') => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

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

export function TodayView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: TodayViewProps) {
  const now = useNow();
  const { activeStage, ageInWeeks, isBrowsing, isBeyondContent } = useActiveStage();
  const dateKey = getParentDayKey(now);
  const night = isNightHours(now);
  const [whyOpen, setWhyOpen] = useState(false);

  const parentName = useAppStore((s) => s.parentName);
  const babyName = useAppStore((s) => s.babyName);
  const practicedByDate = useAppStore((s) => s.practicedByDate);
  const practicedToday = practicedByDate[dateKey] ?? EMPTY_IDS;
  const anotherCount = useAppStore((s) => s.anotherCountByDate[dateKey] ?? 0);
  const mood = useAppStore((s) => s.moodByDate[dateKey] ?? null);
  const togglePracticed = useAppStore((s) => s.togglePracticed);
  const showAnotherPractice = useAppStore((s) => s.showAnotherPractice);
  const setMood = useAppStore((s) => s.setMood);

  const stagePractices = useMemo(
    () => PRACTICES.filter((p) => p.stages.includes(activeStage.id)),
    [activeStage.id],
  );

  const practice = pickDailyPractice({
    stageId: activeStage.id,
    practices: PRACTICES,
    dateKey,
    offset: anotherCount,
  });

  const practiceIndex = practice
    ? stagePractices.findIndex((p) => p.id === practice.id) + 1
    : 0;

  // Quiet, streak-free count of distinct reps tried in this stage across stored history
  const triedInStageCount = useMemo(() => {
    const allTried = new Set(Object.values(practicedByDate).flat());
    return stagePractices.filter((p) => allTried.has(p.id)).length;
  }, [practicedByDate, stagePractices]);

  const isPracticed = practice ? practicedToday.includes(practice.id) : false;
  const practicedAnother = !isPracticed && practicedToday.length > 0;
  const activeMoodOption = MOOD_OPTIONS.find((m) => m.id === mood);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            {night ? 'Quiet Night' : 'Today'}
            {parentName ? ` · ${parentName}` : ''}
          </p>
          <h1 className="mt-0.5 text-xl font-semibold text-ink">{activeStage.subtitle}</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted">{activeStage.focusSummary}</p>
          {isBeyondContent && (
            <p className="mt-1 text-xs text-sage">
              Content currently covers up to 12 months—more stages coming.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenStagePicker}
          aria-label={`Settings and baby stage: ${activeStage.label}`}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-right text-xs transition active:border-amber"
        >
          <span>
            <span className="block font-medium text-amber">
              {babyName || activeStage.label}
            </span>
            {isBrowsing ? (
              <span className="block text-xs text-muted">Browsing · return</span>
            ) : ageInWeeks !== null ? (
              <span className="block text-xs text-muted">Week {ageInWeeks}</span>
            ) : babyName ? (
              <span className="block text-xs text-muted">{activeStage.label}</span>
            ) : null}
          </span>
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted" />
        </button>
      </header>

      {/* Functional 3 AM Night Companion */}
      {night && (
        <section
          aria-label="Night Companion"
          className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-amber/25"
        >
          <p className="flex items-center gap-2 text-xs font-medium text-amber">
            <Moon className="h-3.5 w-3.5" />
            Night Companion
          </p>
          <p className="text-[15px] leading-relaxed text-ink/95">
            Keep lights low and voices slow. Need a quick pause or breath right now?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onOpenSos('baby')}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-amber px-3 text-sm font-semibold text-canvas transition active:scale-[0.99]"
            >
              <Moon className="h-4 w-4" />
              La Pause ({formatSeconds(activeStage.laPauseSeconds)})
            </button>
            <button
              type="button"
              onClick={() => onOpenSos('parent')}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-line bg-elevated px-3 text-sm font-medium text-ink transition active:border-amber"
            >
              <HeartHandshake className="h-4 w-4 text-sage" />
              Breathe
            </button>
          </div>
        </section>
      )}

      {/* Block 1: Today's Practice */}
      {practice && (
        <section
          aria-label="Today's Practice"
          className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-white/[0.04]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber">
              <Sparkles className="h-3.5 w-3.5" />
              {night ? 'For when morning comes' : 'Today’s Practice'}
            </span>
            <button
              type="button"
              onClick={() => onOpenFramework?.(practice.framework)}
              className="-my-2 inline-flex min-h-[44px] items-center"
            >
              <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-muted underline decoration-line underline-offset-2 transition active:text-ink">
                {FRAMEWORK_LABELS[practice.framework]}
              </span>
            </button>
          </div>

          <div className="space-y-2.5">
            <h2 className="text-lg font-semibold leading-snug text-ink">{practice.title}</h2>
            <p className="text-[15px] leading-relaxed text-ink/95">{practice.prompt}</p>
            {practice.safetyNote && (
              <p className="flex gap-2 rounded-xl border border-sage/30 p-3 text-sm leading-relaxed text-ink/90">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>{practice.safetyNote}</span>
              </p>
            )}

            <button
              type="button"
              aria-expanded={whyOpen}
              onClick={() => setWhyOpen((o) => !o)}
              className="-my-1 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted transition active:text-ink"
            >
              {whyOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Why this works
            </button>
            {whyOpen && (
              <p className="rounded-xl bg-canvas p-3.5 text-sm leading-relaxed text-muted">
                {practice.whyItWorks}
              </p>
            )}
          </div>

          {practicedAnother && (
            <p className="text-sm text-sage">✓ You already practiced one today. This one’s a bonus.</p>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => togglePracticed(practice.id, dateKey)}
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
              onClick={() => {
                setWhyOpen(false);
                showAnotherPractice(dateKey);
              }}
              aria-label="Show another practice"
              className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated px-3.5 text-xs font-medium text-muted transition active:border-amber active:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Another</span>
              {stagePractices.length > 1 && (
                <span className="tabular-nums text-muted/80">
                  {practiceIndex}/{stagePractices.length}
                </span>
              )}
            </button>
          </div>

          {triedInStageCount > 0 && (
            <p className="text-xs text-muted">
              {triedInStageCount} of {stagePractices.length} {activeStage.subtitle.toLowerCase()} practices tried recently
            </p>
          )}
        </section>
      )}

      {/* Block 2: 1-Tap Parent Check-In */}
      <section
        aria-label="Parent Check-In"
        className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-white/[0.04]"
      >
        <h2 className="text-[15px] font-medium text-ink">How are you holding up right now?</h2>

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
            <p className="text-sm leading-relaxed text-ink/90">{activeMoodOption.response}</p>
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
