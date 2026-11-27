import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Ear,
  HeartHandshake,
  Moon,
  Pause,
  Phone,
  Play,
  RotateCcw,
  ShieldCheck,
  Vibrate,
} from 'lucide-react';
import {
  CRY_CUES,
  CRY_ESCALATION,
  LA_PAUSE_COMPLETE_GUIDE,
  LA_PAUSE_ESCALATION,
  NEVER_SHAKE,
  PEDIATRICIAN_DISCLAIMER,
  REPAIR_SCRIPTS,
  SAFE_SLEEP_REMINDER,
  SOS_PINNED_SUMMARY,
  SUPPORT_LINES,
  SUPPORT_LINES_NOTE,
  TRIGGER_CHECK,
} from '../../content/sos';
import { useActiveStage } from '../shared/useActiveStage';
import { useDialog } from '../shared/useDialog';

export type SosPath = 'triage' | 'baby' | 'parent';
type ParentTab = 'repair' | 'trigger' | 'support';

interface SosOverlayProps {
  initialPath?: 'baby' | 'parent';
  autoStartTimer?: boolean;
  onClose: () => void;
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Wall-clock countdown with optional vibration on completion and Screen Wake Lock
 * so a 3 AM parent doesn't have to keep tapping a glowing screen.
 */
function useLaPauseTimer(
  totalSeconds: number,
  vibrateOnDone: boolean,
  autoStart = false,
) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [endsAt, setEndsAt] = useState<number | null>(() =>
    autoStart ? Date.now() + totalSeconds * 1000 : null,
  );
  const [completed, setCompleted] = useState(false);
  const vibrateRef = useRef(vibrateOnDone);
  vibrateRef.current = vibrateOnDone;

  useEffect(() => {
    if (endsAt === null) return;
    let cancelled = false;
    let wakeLock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
    };
    nav.wakeLock
      ?.request('screen')
      .then((lock) => {
        if (cancelled) {
          lock.release().catch(() => {});
        } else {
          wakeLock = lock;
        }
      })
      .catch(() => {});

    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setEndsAt(null);
        setCompleted(true);
        if (vibrateRef.current && typeof navigator.vibrate === 'function') {
          navigator.vibrate([120, 80, 120]);
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      wakeLock?.release().catch(() => {});
    };
  }, [endsAt]);

  return {
    remaining,
    completed,
    running: endsAt !== null,
    progress: totalSeconds > 0 ? remaining / totalSeconds : 0,
    start: () => {
      const base = remaining === 0 ? totalSeconds : remaining;
      setCompleted(false);
      setRemaining(base);
      setEndsAt(Date.now() + base * 1000);
    },
    pause: () => setEndsAt(null),
    reset: () => {
      setEndsAt(null);
      setCompleted(false);
      setRemaining(totalSeconds);
    },
  };
}

/**
 * Live 4s inhale / 6s exhale breathing cadence. Text stays crisp and stationary
 * while the concentric orb expands/contracts gently (and still works under reduced motion).
 */
function BreathingPacer() {
  const [totalSec, setTotalSec] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setStarted(true));
    const id = window.setInterval(() => {
      setTotalSec((prev) => prev + 1);
    }, 1000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const elapsedSec = totalSec % 10;
  const completedBreaths = Math.floor(totalSec / 10);
  const isInhale = elapsedSec < 4;
  const phaseCountdown = isInhale ? 4 - elapsedSec : 10 - elapsedSec;
  const expanded = started && isInhale;

  return (
    <div className="flex flex-col items-center space-y-4 rounded-3xl bg-surface p-6 text-center ring-1 ring-line">
      <div className="relative flex h-36 w-36 items-center justify-center">
        {/* Outer luminous halo */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-full bg-sage/10 transition-[transform,opacity] ease-in-out motion-reduce:transition-none ${
            isInhale ? 'duration-[4000ms]' : 'duration-[6000ms]'
          } ${expanded ? 'scale-115 opacity-90' : 'scale-80 opacity-35'}`}
        />
        {/* Inner tactile ring */}
        <div
          aria-hidden="true"
          className={`absolute inset-3 rounded-full border border-sage/50 bg-sage/15 transition-[transform,opacity] ease-in-out motion-reduce:transition-none ${
            isInhale ? 'duration-[4000ms]' : 'duration-[6000ms]'
          } ${expanded ? 'scale-110 opacity-95' : 'scale-85 opacity-55'}`}
        />
        <div className="relative z-10 text-center">
          <span className="block font-serif text-base text-sage">
            {isInhale ? 'Breathe in' : 'Breathe out'}
          </span>
          <span className="mt-0.5 block text-xs tabular-nums text-muted">{phaseCountdown}s</span>
        </div>
      </div>

      {completedBreaths >= 3 ? (
        <p role="status" className="text-sm font-medium text-sage">
          3 slow breaths done. Feeling a notch steadier? Pick a next step below.
        </p>
      ) : (
        <p className="text-xs tabular-nums text-muted">
          Breath {completedBreaths + 1} of 3
        </p>
      )}

      <p className="font-serif text-lg text-ink">Your calm is the anchor.</p>
      <p className="text-sm leading-relaxed text-muted">
        A tight chest or rising anger is your nervous system asking for a pause—not a sign you’re
        failing.
      </p>
    </div>
  );
}

export function SosOverlay({ initialPath, autoStartTimer, onClose }: SosOverlayProps) {
  const { activeStage } = useActiveStage();
  const [path, setPath] = useState<SosPath>(initialPath ?? 'triage');
  const [parentTab, setParentTab] = useState<ParentTab>('repair');
  const [vibrateOnDone, setVibrateOnDone] = useState(true);
  const [safetyExpanded, setSafetyExpanded] = useState(false);

  const timer = useLaPauseTimer(
    activeStage.laPauseSeconds,
    vibrateOnDone,
    initialPath === 'baby' && Boolean(autoStartTimer),
  );
  const dialogRef = useDialog<HTMLDivElement>(onClose);

  const stageCues = CRY_CUES.filter(
    (cue) => !cue.stages || cue.stages.includes(activeStage.id),
  );

  const goTo = (next: SosPath) => {
    timer.reset();
    setPath(next);
  };

  const ringRadius = 58;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - timer.progress);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      className="bg-nursery-glow fixed inset-0 z-50 flex flex-col bg-canvas text-ink outline-none"
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {/* Header */}
        <div>
          <p className="text-xs tracking-widest uppercase text-amber">
            Quiet Support · {activeStage.label}
          </p>
          <h1 id="sos-title" className="mt-1 font-serif text-2xl font-normal text-ink">
            {path === 'triage' && 'Take one slow breath.'}
            {path === 'baby' && 'La Pause · 3 AM Companion'}
            {path === 'parent' && 'Reset & Repair'}
          </h1>
        </div>

        {/* Scrollable Body */}
        <div className="my-4 flex flex-1 flex-col space-y-4 overflow-y-auto pr-1">
          {path === 'triage' && (
            <div className="mt-auto space-y-3 pb-2">
              <p className="text-sm text-muted">What needs support right now?</p>

              <button
                type="button"
                onClick={() => goTo('baby')}
                className="flex min-h-[88px] w-full items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 text-left transition active:border-amber"
              >
                <Moon className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                <div>
                  <span className="block text-base font-semibold text-ink">
                    {activeStage.id === '0-6w'
                      ? 'Sleep grunts / 3 AM stirring'
                      : 'Baby is crying / 3 AM wake-up'}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {activeStage.id === '0-6w'
                      ? `${formatSeconds(activeStage.laPauseSeconds)} La Pause for active sleep (feed if truly crying)`
                      : `${formatSeconds(activeStage.laPauseSeconds)} La Pause timer & cry cues`}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => goTo('parent')}
                className="flex min-h-[88px] w-full items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 text-left transition active:border-amber"
              >
                <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                <div>
                  <span className="block text-base font-semibold text-ink">
                    I’m overwhelmed / triggered
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    Guided breathing, safe crib pause, &amp; repair scripts
                  </span>
                </div>
              </button>
            </div>
          )}

          {path === 'baby' && (
            <div className="space-y-4">
              <div className="space-y-4 rounded-2xl bg-surface p-5 text-center ring-1 ring-line">
                <p className="text-sm leading-relaxed text-muted">{activeStage.laPauseNote}</p>

                {/* Circular Progress Ring + Countdown */}
                <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                  <svg className="h-36 w-36 -rotate-90" viewBox="0 0 132 132" aria-hidden="true">
                    <circle
                      cx="66"
                      cy="66"
                      r={ringRadius}
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="66"
                      cy="66"
                      r={ringRadius}
                      fill="none"
                      stroke="var(--color-amber)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringDashOffset}
                      className="transition-[stroke-dashoffset] duration-300"
                    />
                  </svg>
                  <div
                    role="timer"
                    aria-live="off"
                    className="absolute text-3xl font-semibold tabular-nums tracking-tight text-amber"
                  >
                    {formatSeconds(timer.remaining)}
                  </div>
                </div>

                {timer.completed && (
                  <p
                    role="status"
                    className="rounded-xl border border-sage/35 bg-canvas p-3.5 text-sm leading-relaxed text-ink"
                  >
                    {LA_PAUSE_COMPLETE_GUIDE}
                  </p>
                )}

                <div className="flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={timer.running ? timer.pause : timer.start}
                    className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-amber px-4 text-sm font-semibold text-on-amber"
                  >
                    {timer.running ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause timer
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Start La Pause
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={timer.reset}
                    aria-label="Reset timer"
                    className="flex min-h-[52px] items-center justify-center rounded-xl border border-line bg-elevated px-4 text-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-xs text-muted">
                  {typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function' ? (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={vibrateOnDone}
                      onClick={() => setVibrateOnDone((v) => !v)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs text-muted"
                    >
                      <Vibrate className={`h-3.5 w-3.5 ${vibrateOnDone ? 'text-sage' : 'text-muted'}`} />
                      Vibrate when done: <span className="text-ink">{vibrateOnDone ? 'On' : 'Off'}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-muted">Screen stays awake while running</span>
                  )}
                  <span className="text-right">{LA_PAUSE_ESCALATION.split('.')[0]}.</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
                  What might this cry be communicating?
                </h2>
                <div className="divide-y divide-line/70 rounded-2xl bg-surface px-4 ring-1 ring-line">
                  {stageCues.map((cue) => (
                    <div key={cue.id} className="py-3.5">
                      <p className="text-[15px] font-medium text-ink">{cue.label}</p>
                      <p className="mt-1 text-sm text-muted">{cue.meaning}</p>
                      <p className="mt-1.5 text-sm text-sage">{cue.nextStep}</p>
                    </div>
                  ))}
                </div>
                <p className="rounded-xl border border-amber/30 bg-surface p-4 text-sm leading-relaxed text-ink/90">
                  {CRY_ESCALATION}
                </p>
              </div>
            </div>
          )}

          {path === 'parent' && (
            <div className="space-y-4">
              {/* Step 1: Regulate First */}
              <BreathingPacer />

              <div className="rounded-2xl border border-sage/30 bg-surface p-4">
                <p className="flex gap-2.5 text-sm leading-relaxed text-ink/95">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <span>{SAFE_SLEEP_REMINDER}</span>
                </p>
              </div>

              {/* Step 2: Progressive Support Tabs */}
              <div className="space-y-3">
                <div role="group" aria-label="Next calm step" className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'repair', label: 'Repair' },
                      { id: 'trigger', label: 'Trigger check' },
                      { id: 'support', label: 'Crisis help' },
                    ] as const
                  ).map((tab) => {
                    const active = parentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setParentTab(tab.id)}
                        className={`min-h-[44px] rounded-xl border px-2 text-xs font-medium transition ${
                          active
                            ? 'border-amber bg-amber/15 text-amber'
                            : 'border-line bg-surface text-muted'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {parentTab === 'repair' && (
                  <div className="space-y-3">
                    {REPAIR_SCRIPTS.map((script) => (
                      <div
                        key={script.id}
                        className="space-y-2.5 rounded-3xl bg-surface p-5 ring-1 ring-line"
                      >
                        <p className="text-xs font-medium text-amber">{script.situation}</p>
                        <p className="border-l-2 border-amber/50 pl-3.5 font-serif text-[17px] italic leading-relaxed text-ink">
                          {script.outLoud}
                        </p>
                        <p className="text-sm text-muted">{script.innerReset}</p>
                      </div>
                    ))}
                  </div>
                )}

                {parentTab === 'trigger' && (
                  <div className="space-y-2.5 rounded-2xl bg-surface p-4 ring-1 ring-line">
                    <p className="flex items-center gap-2 text-xs font-semibold text-sage">
                      <Ear className="h-4 w-4" /> Once you’ve taken two slow breaths:
                    </p>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink/90">
                      {TRIGGER_CHECK.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {parentTab === 'support' && (
                  <div className="space-y-2.5">
                    <div className="rounded-2xl border border-amber/40 bg-surface p-4">
                      <p className="text-xs font-semibold text-amber">
                        If you feel close to losing control
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/95">{NEVER_SHAKE}</p>
                    </div>
                    {SUPPORT_LINES.map((line) => (
                      <a
                        key={line.id}
                        href={line.href}
                        className="flex min-h-[56px] items-start gap-3 rounded-xl border border-line bg-surface p-3.5"
                      >
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                        <span>
                          <span className="block text-sm font-medium text-ink">{line.label}</span>
                          <span className="mt-0.5 block text-xs text-muted">{line.detail}</span>
                        </span>
                      </a>
                    ))}
                    <p className="text-xs text-muted">{SUPPORT_LINES_NOTE}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact Expandable Pinned Safety Bar + Bottom Actions */}
        <div className="space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="rounded-xl border border-sage/30 bg-surface">
            <button
              type="button"
              aria-expanded={safetyExpanded}
              onClick={() => setSafetyExpanded((v) => !v)}
              className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-muted"
            >
              <span className="flex items-center gap-2 text-ink/90">
                <ShieldCheck className="h-4 w-4 shrink-0 text-sage" />
                {SOS_PINNED_SUMMARY}
              </span>
              {safetyExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
              ) : (
                <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
              )}
            </button>
            {safetyExpanded && (
              <div className="space-y-2 border-t border-line px-3 py-3 text-xs leading-relaxed text-muted">
                <p className="text-ink/90">{SAFE_SLEEP_REMINDER}</p>
                <p>{NEVER_SHAKE}</p>
                <p>{PEDIATRICIAN_DISCLAIMER}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2.5">
            {path !== 'triage' && (
              <button
                type="button"
                onClick={() => goTo('triage')}
                className="min-h-[52px] flex-1 rounded-xl border border-line bg-surface text-sm font-medium text-ink"
              >
                Switch path
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[52px] flex-1 rounded-xl bg-elevated text-sm font-semibold text-ink"
            >
              Back to Anchor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
