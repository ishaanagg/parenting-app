import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Heart,
  HeartHandshake,
  Moon,
  Play,
  RefreshCw,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { PRACTICES } from '../../content/practices';
import {
  getParentDayKey,
  isAfterWorkHours,
  isNightHours,
  pickDailyPractice,
} from '../../domain/stageEngine';
import type { BookFramework, ParentMood, PracticeRep } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import {
  BookmarkIconButton,
  PhilosophyTagButton,
  ShareIconButton,
} from '../shared/uiPrimitives';
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
      className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
    >
      {/* Uniform 26px Top Metadata Row: Kicker on left, Philosophy Capsule flush on right */}
      <div className="flex min-h-[26px] items-center justify-between gap-2.5">
        <span
          className={`inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase ${kickerColor}`}
        >
          {accentTone === 'sage' && <Heart className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          <span className="ui-pill-label truncate">{kicker}</span>
        </span>
        <PhilosophyTagButton framework={practice.framework} onOpenFramework={onOpenFramework} />
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
      </div>

      {practicedAnotherInTrack && (
        <p className="text-xs font-medium text-sage">
          ✓ You already did one today. This one’s a bonus.
        </p>
      )}

      {/* Primary Commitment Row: Generous width so button labels never wrap */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onTogglePracticed}
          aria-pressed={isPracticed}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold whitespace-nowrap transition active:scale-[0.98] ${
            isPracticed
              ? 'border border-sage/45 bg-sage/15 text-sage'
              : accentTone === 'amber'
                ? 'bg-amber text-on-amber'
                : 'border border-sage/45 bg-sage/15 text-sage'
          }`}
        >
          <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>{isPracticed ? doneButtonLabels.active : doneButtonLabels.idle}</span>
        </button>

        <button
          type="button"
          onClick={onAnother}
          aria-label={anotherAriaLabel}
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated/80 px-3.5 text-xs font-medium whitespace-nowrap text-muted transition active:scale-[0.98] active:border-amber active:text-ink"
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          <span>Another</span>
          {poolLength > 1 && (
            <span className="tabular-nums text-muted/80">
              {practiceIndex}/{poolLength}
            </span>
          )}
        </button>
      </div>

      {whyOpen && (
        <p
          id={whyRegionId}
          className="border-l-2 border-line pl-3.5 text-sm leading-relaxed text-muted"
        >
          {practice.whyItWorks}
        </p>
      )}

      {/* Standardized Card Footer: Disclosure on left, 36px Save + Share circles flush on right */}
      <footer className="flex items-center justify-between gap-3 border-t border-line/65 pt-3">
        <button
          type="button"
          aria-label={whyAriaLabel}
          aria-expanded={whyOpen}
          aria-controls={whyRegionId}
          onClick={onToggleWhy}
          className="relative inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted transition active:text-ink after:absolute after:-inset-y-1 after:inset-x-0"
        >
          <ChevronRight
            aria-hidden="true"
            className={`h-3.5 w-3.5 shrink-0 text-amber transition-transform duration-200 motion-reduce:transition-none ${
              whyOpen ? 'rotate-90' : ''
            }`}
          />
          <span>Why this works</span>
        </button>

        <div className="flex items-center gap-2">
          <BookmarkIconButton
            saved={isSaved}
            label={isSaved ? bookmarkLabels.remove : bookmarkLabels.save}
            onToggle={onToggleSaved}
          />
          <ShareIconButton copied={isCopied} label={shareLabel} onShare={onShare} />
        </div>
      </footer>

      {triedCount > 0 && (
        <p className="text-xs text-muted/85">
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
  const deepNight = now.getHours() >= 23 || now.getHours() < 6;
  const afterWork = isAfterWorkHours(now);
  const [kidWhyOpen, setKidWhyOpen] = useState(false);
  const [coupleWhyOpen, setCoupleWhyOpen] = useState(false);
  const [showDaytimeAtNight, setShowDaytimeAtNight] = useState(false);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [sighStep, setSighStep] = useState<number | null>(null);

  useEffect(() => {
    if (sighStep === null) return;
    if (sighStep >= 16) {
      setSighStep(null);
      return;
    }
    const id = window.setTimeout(() => setSighStep((s) => (s === null ? null : s + 1)), 1000);
    return () => window.clearTimeout(id);
  }, [sighStep]);

  const sighCue = useMemo(() => {
    if (sighStep === null) return null;
    const secInCycle = sighStep % 8;
    const cycleNum = Math.floor(sighStep / 8) + 1;
    if (secInCycle < 2) return `Sigh ${cycleNum}/2 · Deep inhale through nose...`;
    if (secInCycle === 2) return `Sigh ${cycleNum}/2 · Quick second top-off sniff!`;
    return `Sigh ${cycleNum}/2 · Long, slow mouth exhale (${8 - secInCycle}s)...`;
  }, [sighStep]);

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

  // 1-based position within today's rotation so the first card of the day always starts at 1/N
  const kidPracticeIndex =
    kidPractice && kidStagePractices.length > 0
      ? (kidAnotherCount % kidStagePractices.length) + 1
      : 0;

  const couplePracticeIndex =
    couplePractice && coupleStagePractices.length > 0
      ? (coupleAnotherCount % coupleStagePractices.length) + 1
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

  const showDailyCards = !deepNight || showDaytimeAtNight;

  return (
    <div className="animate-calm-in space-y-4">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted">
            {night ? 'Quiet Night' : 'Today'}
            {parentName ? ` · ${parentName}` : ''}
          </p>
          <h1 className="mt-1 font-serif text-[26px] leading-tight font-normal tracking-tight text-ink">
            {activeStage.subtitle}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted">{activeStage.focusSummary}</p>
          {isBeyondContent && (
            <p className="mt-1.5 text-xs text-sage">
              Content covers up to 3 years—showing 2–3 Years.
            </p>
          )}
        </div>
      </header>

      {/* 3 AM Night Companion */}
      {night && (
        <section
          aria-label="Night Companion"
          className="space-y-3.5 rounded-2xl bg-surface p-5 ring-1 ring-amber/25"
        >
          <p className="text-[11px] font-semibold tracking-widest uppercase text-amber">
            Night Companion
          </p>
          <p className="font-serif text-[20px] leading-snug text-ink">
            Lights low. Voice slow. What helps right now?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onOpenSos('baby', true)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber px-3 text-sm font-semibold whitespace-nowrap text-on-amber transition active:scale-[0.98]"
            >
              <Moon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span>La Pause ({formatSeconds(activeStage.laPauseSeconds)})</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenSos('parent')}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-elevated/85 px-3 text-sm font-medium whitespace-nowrap text-ink transition active:scale-[0.98] active:border-amber"
            >
              <HeartHandshake aria-hidden="true" className="h-4 w-4 shrink-0 text-sage" />
              <span>Breathe</span>
            </button>
          </div>
        </section>
      )}

      {/* Deep night (11 PM – 6 AM): tuck daytime habits behind 1 tap */}
      {deepNight && (
        <button
          type="button"
          aria-expanded={showDaytimeAtNight}
          onClick={() => setShowDaytimeAtNight((v) => !v)}
          className="flex h-11 w-full items-center justify-between rounded-2xl border border-line bg-surface/80 px-4 text-xs font-medium text-muted transition active:scale-[0.99] active:text-ink"
        >
          <span className="inline-flex items-center gap-2">
            <Sun aria-hidden="true" className="h-3.5 w-3.5 text-amber" />
            <span>{showDaytimeAtNight ? 'Hide daytime practices' : 'Show daytime practices'}</span>
          </span>
          {showDaytimeAtNight ? (
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      )}

      {showDailyCards && kidPractice && (
        <DailyPracticeCard
          ariaLabel="Today's Practice"
          kicker={babyName ? `For ${babyName}` : 'For Your Child'}
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

      {showDailyCards && couplePractice && (
        <DailyPracticeCard
          ariaLabel="For You and Your Marriage"
          kicker="You & Marriage"
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

      {/* 60-Second After-Work Bridge */}
      {!night && (
        <section
          aria-label="After-Work Reset"
          className="rounded-2xl bg-surface p-5 ring-1 ring-line"
        >
          <details open={afterWork ? true : undefined} className="group">
            <summary className="flex min-h-[40px] cursor-pointer list-none items-center justify-between gap-2 select-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 font-serif text-[19px] font-normal text-ink">
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-amber transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
                />
                <Briefcase aria-hidden="true" className="h-4 w-4 shrink-0 text-amber" />
                <span>After-Work Reset</span>
              </span>
              <span className="rounded-full border border-line/85 bg-elevated/85 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-muted">
                <span className="ui-pill-label">60s bridge</span>
              </span>
            </summary>

            <div className="mt-3.5 space-y-3.5 border-t border-line/65 pt-3.5 text-sm leading-relaxed">
              <p className="border-l-2 border-sage/55 pl-3.5 text-ink/90">
                <span className="font-semibold text-sage">Drop career guilt: </span>
                Focused adult work enriches your parenting—close the work tab cleanly before
                stepping through the door.
              </p>

              {sighCue ? (
                <p
                  role="status"
                  className="py-2 text-center font-serif text-base italic text-amber"
                >
                  {sighCue}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setSighStep(0)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber/40 bg-amber/15 px-3 text-xs font-semibold text-amber transition active:scale-[0.98]"
                >
                  <Play aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Start 2 Physiological Sighs (16s)</span>
                </button>
              )}

              <p className="text-xs text-muted">
                <span className="font-semibold text-ink">First 10 seconds inside: </span>
                Greet your spouse warmly first (6-second kiss), then invite your child into one real
                dinner task instead of entertaining.
              </p>
            </div>
          </details>
        </section>
      )}

      {/* 1-Tap Parent Check-In */}
      <section
        aria-label="Parent Check-In"
        className="space-y-3.5 rounded-2xl bg-surface p-5 ring-1 ring-line"
      >
        <h2 className="font-serif text-[19px] font-normal text-ink">
          How are you holding up right now?
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {MOOD_OPTIONS.map((option) => {
            const selected = mood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMood(option.id, dateKey)}
                className={`h-11 rounded-xl border px-3 text-sm font-medium whitespace-nowrap transition active:scale-[0.98] ${
                  selected
                    ? 'border-amber/70 bg-amber/15 text-amber'
                    : 'border-line bg-canvas/75 text-muted active:text-ink'
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
                className="h-11 w-full rounded-xl border border-amber/40 bg-amber/15 px-4 text-sm font-semibold text-amber transition active:scale-[0.98]"
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
