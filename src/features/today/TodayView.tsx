import { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  HeartHandshake,
  Moon,
  RefreshCw,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { PRACTICES } from '../../content/practices';
import { getParentDayKey, isNightHours, pickDailyPractice } from '../../domain/stageEngine';
import type { BookFramework, ParentMood, PracticeRep } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';
import { formatSeconds } from '../sos/SosOverlay';

interface TodayViewProps {
  onOpenStagePicker: () => void;
  onOpenSos: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
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
    response: 'It’s okay to need physical space. A 2-minute safe crib pause—or tapping out to your spouse—is healthy.',
    suggestSos: true,
  },
  {
    id: 'triggered',
    label: 'Triggered',
    response: 'Your nervous system is loud right now. Pause before reacting—you’re safe.',
    suggestSos: true,
  },
];

interface DailyPracticeCardProps {
  ariaLabel: string;
  kicker: string;
  accentTone: 'amber' | 'sage';
  practice: PracticeRep;
  practiceIndex: number;
  poolLength: number;
  triedCount: number;
  stageNoun: string;
  isPracticed: boolean;
  practicedAnotherInTrack: boolean;
  isSaved: boolean;
  isCopied: boolean;
  whyOpen: boolean;
  doneButtonLabels: { idle: string; active: string };
  bookmarkLabels: { save: string; remove: string };
  shareLabel: string;
  whyAriaLabel: string;
  anotherAriaLabel: string;
  whyRegionId: string;
  onToggleWhy: () => void;
  onToggleSaved: () => void;
  onShare: () => void;
  onOpenFramework?: (framework: BookFramework) => void;
  onTogglePracticed: () => void;
  onAnother: () => void;
}

function DailyPracticeCard({
  ariaLabel,
  kicker,
  accentTone,
  practice,
  practiceIndex,
  poolLength,
  triedCount,
  stageNoun,
  isPracticed,
  practicedAnotherInTrack,
  isSaved,
  isCopied,
  whyOpen,
  doneButtonLabels,
  bookmarkLabels,
  shareLabel,
  whyAriaLabel,
  anotherAriaLabel,
  whyRegionId,
  onToggleWhy,
  onToggleSaved,
  onShare,
  onOpenFramework,
  onTogglePracticed,
  onAnother,
}: DailyPracticeCardProps) {
  const kickerColor = accentTone === 'amber' ? 'text-amber' : 'text-sage';

  return (
    <section
      aria-label={ariaLabel}
      className="space-y-4 rounded-3xl bg-surface p-5 ring-1 ring-line"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`flex items-center gap-1.5 text-xs tracking-widest uppercase ${kickerColor}`}>
          {accentTone === 'sage' && <Heart className="h-3.5 w-3.5" aria-hidden="true" />}
          {kicker}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label={isSaved ? bookmarkLabels.remove : bookmarkLabels.save}
            aria-pressed={isSaved}
            onClick={onToggleSaved}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition active:text-amber"
          >
            <Bookmark
              aria-hidden="true"
              className={`h-4 w-4 ${isSaved ? 'fill-amber text-amber' : ''}`}
            />
          </button>
          <button
            type="button"
            aria-label={shareLabel}
            onClick={onShare}
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition active:text-ink"
          >
            {isCopied ? (
              <Check aria-hidden="true" className="h-4 w-4 text-sage" />
            ) : (
              <Share2 aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onOpenFramework?.(practice.framework)}
            className="-my-2 inline-flex min-h-[44px] items-center"
          >
            <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-muted transition active:text-ink">
              {FRAMEWORK_LABELS[practice.framework]}
            </span>
          </button>
        </div>
      </div>

      <div key={practice.id} className="animate-calm-in space-y-2.5">
        <h2 className="font-serif text-[20px] leading-snug font-normal text-ink">
          {practice.title}
        </h2>
        <p className="text-[15px] leading-relaxed text-ink/90">{practice.prompt}</p>
        {practice.safetyNote && (
          <p className="flex gap-2.5 border-l-2 border-sage/60 pl-3.5 text-sm leading-relaxed text-ink/90">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            <span>{practice.safetyNote}</span>
          </p>
        )}

        <button
          type="button"
          aria-label={whyAriaLabel}
          aria-expanded={whyOpen}
          aria-controls={whyRegionId}
          onClick={onToggleWhy}
          className="-my-1 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted transition active:text-ink"
        >
          {whyOpen ? (
            <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          Why this works
        </button>
        {whyOpen && (
          <p
            id={whyRegionId}
            className="border-l-2 border-line pl-3.5 text-sm leading-relaxed text-muted"
          >
            {practice.whyItWorks}
          </p>
        )}
      </div>

      {practicedAnotherInTrack && (
        <p className="text-sm text-sage">✓ You already did one today. This one’s a bonus.</p>
      )}

      <div className="flex gap-2.5 pt-0.5">
        <button
          type="button"
          onClick={onTogglePracticed}
          aria-pressed={isPracticed}
          className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition active:scale-[0.98] ${
            isPracticed
              ? 'border border-sage/40 bg-sage/15 text-sage'
              : accentTone === 'amber'
                ? 'bg-amber text-on-amber'
                : 'border border-sage/45 bg-sage/15 text-sage'
          }`}
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          {isPracticed ? doneButtonLabels.active : doneButtonLabels.idle}
        </button>

        <button
          type="button"
          onClick={onAnother}
          aria-label={anotherAriaLabel}
          className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-2xl border border-line bg-elevated px-3.5 text-xs font-medium text-muted transition active:border-amber active:text-ink"
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Another</span>
          {poolLength > 1 && (
            <span className="tabular-nums text-muted/75">
              {practiceIndex}/{poolLength}
            </span>
          )}
        </button>
      </div>

      {triedCount > 0 && (
        <p className="text-xs text-muted/90">
          {triedCount} of {poolLength} {stageNoun} tried recently
        </p>
      )}
    </section>
  );
}

export function TodayView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: TodayViewProps) {
  const now = useNow();
  const { activeStage, isBeyondContent } = useActiveStage();
  const dateKey = getParentDayKey(now);
  const night = isNightHours(now);
  const [kidWhyOpen, setKidWhyOpen] = useState(false);
  const [coupleWhyOpen, setCoupleWhyOpen] = useState(false);
  const [sharedId, setSharedId] = useState<string | null>(null);

  const parentName = useAppStore((s) => s.parentName);
  const babyName = useAppStore((s) => s.babyName);
  const savedCardIds = useAppStore((s) => s.savedCardIds);
  const practicedByDate = useAppStore((s) => s.practicedByDate);
  const practicedToday = practicedByDate[dateKey] ?? EMPTY_IDS;
  const kidAnotherCount = useAppStore((s) => s.anotherCountByDate[dateKey] ?? 0);
  const coupleAnotherCount = useAppStore((s) => s.coupleAnotherCountByDate[dateKey] ?? 0);
  const mood = useAppStore((s) => s.moodByDate[dateKey] ?? null);
  const togglePracticed = useAppStore((s) => s.togglePracticed);
  const toggleSavedCard = useAppStore((s) => s.toggleSavedCard);
  const showAnotherPractice = useAppStore((s) => s.showAnotherPractice);
  const setMood = useAppStore((s) => s.setMood);

  const kidStagePractices = useMemo(
    () =>
      PRACTICES.filter(
        (p) => (p.track ?? 'kid') === 'kid' && p.stages.includes(activeStage.id),
      ),
    [activeStage.id],
  );

  const coupleStagePractices = useMemo(
    () =>
      PRACTICES.filter(
        (p) => p.track === 'couple' && p.stages.includes(activeStage.id),
      ),
    [activeStage.id],
  );

  const kidPractice = pickDailyPractice({
    stageId: activeStage.id,
    practices: PRACTICES,
    dateKey,
    offset: kidAnotherCount,
    track: 'kid',
  });

  const couplePractice = pickDailyPractice({
    stageId: activeStage.id,
    practices: PRACTICES,
    dateKey,
    offset: coupleAnotherCount,
    track: 'couple',
  });

  const kidPracticeIndex = kidPractice
    ? kidStagePractices.findIndex((p) => p.id === kidPractice.id) + 1
    : 0;

  const couplePracticeIndex = couplePractice
    ? coupleStagePractices.findIndex((p) => p.id === couplePractice.id) + 1
    : 0;

  const allTriedIds = useMemo(
    () => new Set(Object.values(practicedByDate).flat()),
    [practicedByDate],
  );

  const triedKidCount = useMemo(
    () => kidStagePractices.filter((p) => allTriedIds.has(p.id)).length,
    [allTriedIds, kidStagePractices],
  );

  const triedCoupleCount = useMemo(
    () => coupleStagePractices.filter((p) => allTriedIds.has(p.id)).length,
    [allTriedIds, coupleStagePractices],
  );

  const kidIdsSet = useMemo(() => new Set(kidStagePractices.map((p) => p.id)), [kidStagePractices]);
  const coupleIdsSet = useMemo(
    () => new Set(coupleStagePractices.map((p) => p.id)),
    [coupleStagePractices],
  );

  const isKidPracticed = kidPractice ? practicedToday.includes(kidPractice.id) : false;
  const practicedAnotherKid =
    !isKidPracticed && practicedToday.some((id) => kidIdsSet.has(id));

  const isCouplePracticed = couplePractice ? practicedToday.includes(couplePractice.id) : false;
  const practicedAnotherCouple =
    !isCouplePracticed && practicedToday.some((id) => coupleIdsSet.has(id));

  const activeMoodOption = MOOD_OPTIONS.find((m) => m.id === mood);

  const handleShare = (item: PracticeRep) => {
    shareOrCopy(item.title, item.prompt).then((res) => {
      if (res === 'copied') {
        setSharedId(item.id);
        window.setTimeout(() => setSharedId(null), 1800);
      }
    });
  };

  return (
    <div className="animate-calm-in space-y-5">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-xs tracking-widest uppercase text-muted">
            {night ? 'Quiet Night' : 'Today'}
            {parentName ? ` · ${parentName}` : ''}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-ink">
            {activeStage.subtitle}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{activeStage.focusSummary}</p>
          {isBeyondContent && (
            <p className="mt-1.5 text-xs text-sage">
              Content covers up to 3 years—showing 2–3 Years.
            </p>
          )}
        </div>
      </header>

      {/* Functional 3 AM Night Companion */}
      {night && (
        <section
          aria-label="Night Companion"
          className="space-y-4 rounded-3xl bg-surface p-5 ring-1 ring-amber/20"
        >
          <p className="text-xs tracking-widest uppercase text-amber">Night Companion</p>
          <p className="font-serif text-lg leading-snug text-ink">
            Lights low. Voice slow. What helps right now?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onOpenSos('baby', true)}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-amber px-3 text-sm font-semibold text-on-amber transition active:scale-[0.98]"
            >
              <Moon aria-hidden="true" className="h-4 w-4" />
              La Pause ({formatSeconds(activeStage.laPauseSeconds)})
            </button>
            <button
              type="button"
              onClick={() => onOpenSos('parent')}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-line bg-elevated px-3 text-sm font-medium text-ink transition active:border-amber"
            >
              <HeartHandshake aria-hidden="true" className="h-4 w-4 text-sage" />
              Breathe
            </button>
          </div>
        </section>
      )}

      {/* Card 1: Daily Kid Practice */}
      {kidPractice && (
        <DailyPracticeCard
          ariaLabel="Today's Practice"
          kicker={
            night
              ? 'For morning · Kid'
              : babyName
                ? `For ${babyName}`
                : 'For Your Child'
          }
          accentTone="amber"
          practice={kidPractice}
          practiceIndex={kidPracticeIndex}
          poolLength={kidStagePractices.length}
          triedCount={triedKidCount}
          stageNoun={`${activeStage.subtitle.toLowerCase()} practices`}
          isPracticed={isKidPracticed}
          practicedAnotherInTrack={practicedAnotherKid}
          isSaved={savedCardIds.includes(kidPractice.id)}
          isCopied={sharedId === kidPractice.id}
          whyOpen={kidWhyOpen}
          doneButtonLabels={{ idle: 'Mark practiced', active: 'Practiced today' }}
          bookmarkLabels={{ save: 'Bookmark practice', remove: 'Remove bookmark' }}
          shareLabel="Share practice"
          whyAriaLabel="Why this works for your child"
          anotherAriaLabel="Another kid practice"
          whyRegionId="kid-practice-why"
          onToggleWhy={() => setKidWhyOpen((o) => !o)}
          onToggleSaved={() => toggleSavedCard(kidPractice.id)}
          onShare={() => handleShare(kidPractice)}
          onOpenFramework={onOpenFramework}
          onTogglePracticed={() => togglePracticed(kidPractice.id, dateKey)}
          onAnother={() => {
            setKidWhyOpen(false);
            showAnotherPractice(dateKey, 'kid');
          }}
        />
      )}

      {/* Card 2: Daily You & Marriage Habit */}
      {couplePractice && (
        <DailyPracticeCard
          ariaLabel="For You and Your Marriage"
          kicker="For You & Your Marriage"
          accentTone="sage"
          practice={couplePractice}
          practiceIndex={couplePracticeIndex}
          poolLength={coupleStagePractices.length}
          triedCount={triedCoupleCount}
          stageNoun="couple & self habits"
          isPracticed={isCouplePracticed}
          practicedAnotherInTrack={practicedAnotherCouple}
          isSaved={savedCardIds.includes(couplePractice.id)}
          isCopied={sharedId === couplePractice.id}
          whyOpen={coupleWhyOpen}
          doneButtonLabels={{ idle: 'Mark done', active: 'Done today' }}
          bookmarkLabels={{
            save: 'Bookmark marriage habit',
            remove: 'Remove marriage habit bookmark',
          }}
          shareLabel="Share marriage habit"
          whyAriaLabel="Why this works for your marriage"
          anotherAriaLabel="Another marriage habit"
          whyRegionId="couple-practice-why"
          onToggleWhy={() => setCoupleWhyOpen((o) => !o)}
          onToggleSaved={() => toggleSavedCard(couplePractice.id)}
          onShare={() => handleShare(couplePractice)}
          onOpenFramework={onOpenFramework}
          onTogglePracticed={() => togglePracticed(couplePractice.id, dateKey)}
          onAnother={() => {
            setCoupleWhyOpen(false);
            showAnotherPractice(dateKey, 'couple');
          }}
        />
      )}

      {/* Block 3: 1-Tap Parent Check-In */}
      <section
        aria-label="Parent Check-In"
        className="space-y-4 rounded-3xl bg-surface p-5 ring-1 ring-line"
      >
        <h2 className="font-serif text-lg font-normal text-ink">
          How are you holding up right now?
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {MOOD_OPTIONS.map((option) => {
            const selected = mood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMood(option.id, dateKey)}
                className={`min-h-[48px] rounded-2xl border px-3 text-sm font-medium transition active:scale-[0.98] ${
                  selected
                    ? 'border-amber/70 bg-amber/15 text-amber'
                    : 'border-line bg-canvas/70 text-muted'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {activeMoodOption && (
          <div className="animate-calm-in space-y-3 border-l-2 border-amber/50 pl-3.5" aria-live="polite">
            <p className="text-sm leading-relaxed text-ink/90">{activeMoodOption.response}</p>
            {activeMoodOption.suggestSos && (
              <button
                type="button"
                onClick={() => onOpenSos('parent')}
                className="min-h-[48px] w-full rounded-2xl border border-amber/40 bg-amber/15 px-4 text-sm font-semibold text-amber transition active:scale-[0.98]"
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
