import { useEffect, useState } from 'react';
import {
  Ear,
  HeartHandshake,
  Moon,
  Pause,
  Phone,
  Play,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  CRY_CUES,
  CRY_ESCALATION,
  LA_PAUSE_ESCALATION,
  NEVER_SHAKE,
  PEDIATRICIAN_DISCLAIMER,
  REPAIR_SCRIPTS,
  SAFE_SLEEP_REMINDER,
  SOS_PINNED_LINE,
  SUPPORT_LINES,
  SUPPORT_LINES_NOTE,
  TRIGGER_CHECK,
} from '../../content/sos';
import { useActiveStage } from '../shared/useActiveStage';
import { useDialog } from '../shared/useDialog';

export type SosPath = 'triage' | 'baby' | 'parent';

interface SosOverlayProps {
  initialPath?: 'baby' | 'parent';
  onClose: () => void;
}

export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Wall-clock based countdown: survives screen lock / tab throttling because it
 * derives remaining time from a fixed end timestamp instead of counting ticks.
 */
function useLaPauseTimer(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [endsAt, setEndsAt] = useState<number | null>(null);

  useEffect(() => {
    if (endsAt === null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setEndsAt(null);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return {
    remaining,
    running: endsAt !== null,
    start: () => {
      const base = remaining === 0 ? totalSeconds : remaining;
      setRemaining(base);
      setEndsAt(Date.now() + base * 1000);
    },
    pause: () => setEndsAt(null),
    reset: () => {
      setEndsAt(null);
      setRemaining(totalSeconds);
    },
  };
}

export function SosOverlay({ initialPath, onClose }: SosOverlayProps) {
  const { activeStage } = useActiveStage();
  const [path, setPath] = useState<SosPath>(initialPath ?? 'triage');
  const timer = useLaPauseTimer(activeStage.laPauseSeconds);
  const dialogRef = useDialog<HTMLDivElement>(onClose);

  const goTo = (next: SosPath) => {
    timer.reset();
    setPath(next);
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#14110F] text-[#F4EFEA] outline-none"
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-5 pt-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#E09F67]">
              Quiet Support · {activeStage.label}
            </p>
            <h1 id="sos-title" className="text-lg font-semibold text-[#F4EFEA]">
              {path === 'triage' && 'Take one slow breath.'}
              {path === 'baby' && 'La Pause · 3 AM Companion'}
              {path === 'parent' && 'Reset & Repair'}
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close SOS"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#332A24] bg-[#1E1916] text-[#B5A99F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="my-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {path === 'triage' && (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-[#B5A99F]">What needs support right now?</p>

              <button
                type="button"
                onClick={() => goTo('baby')}
                className="flex min-h-[84px] w-full items-start gap-3.5 rounded-2xl border border-[#332A24] bg-[#1E1916] p-4 text-left transition active:border-[#E09F67]"
              >
                <Moon className="mt-0.5 h-5 w-5 shrink-0 text-[#E09F67]" />
                <div>
                  <span className="block text-base font-semibold text-[#F4EFEA]">
                    Baby is crying / 3 AM wake-up
                  </span>
                  <span className="mt-1 block text-xs text-[#B5A99F]">
                    {formatSeconds(activeStage.laPauseSeconds)} La Pause timer &amp; what the cry might mean
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => goTo('parent')}
                className="flex min-h-[84px] w-full items-start gap-3.5 rounded-2xl border border-[#332A24] bg-[#1E1916] p-4 text-left transition active:border-[#E09F67]"
              >
                <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#8FA893]" />
                <div>
                  <span className="block text-base font-semibold text-[#F4EFEA]">
                    I’m overwhelmed / triggered
                  </span>
                  <span className="mt-1 block text-xs text-[#B5A99F]">
                    Breathing pacer, trigger check, safe crib pause &amp; repair scripts
                  </span>
                </div>
              </button>
            </div>
          )}

          {path === 'baby' && (
            <div className="space-y-4">
              <div className="space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5 text-center">
                <p className="text-xs leading-relaxed text-[#B5A99F]">{activeStage.laPauseNote}</p>
                <div
                  role="timer"
                  aria-live="off"
                  className="text-4xl font-semibold tabular-nums tracking-tight text-[#E09F67]"
                >
                  {timer.remaining === 0 ? 'Pause complete' : formatSeconds(timer.remaining)}
                </div>
                <div className="flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={timer.running ? timer.pause : timer.start}
                    className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#E09F67] px-4 text-sm font-semibold text-[#14110F]"
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
                    className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#332A24] bg-[#28211D] px-4 text-[#B5A99F]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#B5A99F]">{LA_PAUSE_ESCALATION}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#B5A99F]">
                  What might this cry be communicating?
                </h2>
                {CRY_CUES.map((cue) => (
                  <div key={cue.id} className="rounded-xl border border-[#332A24] bg-[#1E1916] p-3.5">
                    <p className="text-sm font-medium text-[#F4EFEA]">{cue.label}</p>
                    <p className="mt-1 text-xs text-[#B5A99F]">{cue.meaning}</p>
                    <p className="mt-1.5 text-xs text-[#8FA893]">{cue.nextStep}</p>
                  </div>
                ))}
                <p className="rounded-xl border border-[#E09F67]/30 bg-[#1E1916] p-3.5 text-xs leading-relaxed text-[#F4EFEA]/90">
                  {CRY_ESCALATION}
                </p>
              </div>
            </div>
          )}

          {path === 'parent' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5 text-center">
                <div className="animate-breathe flex h-24 w-24 items-center justify-center rounded-full border border-[#8FA893]/50 bg-[#8FA893]/15">
                  <span className="text-xs font-medium text-[#8FA893]">4s in · 6s out</span>
                </div>
                <p className="text-sm font-medium text-[#F4EFEA]">Your calm is the anchor.</p>
                <p className="text-xs leading-relaxed text-[#B5A99F]">
                  A tight chest or rising anger is your nervous system asking for a pause—not a sign
                  you’re failing. Follow the circle for a few breaths.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E09F67]/40 bg-[#1E1916] p-4">
                <p className="text-xs font-semibold text-[#E09F67]">If you feel close to losing it</p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#F4EFEA]/90">{NEVER_SHAKE}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#332A24] bg-[#1E1916] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-[#8FA893]">
                  <Ear className="h-4 w-4" /> Trigger check
                </p>
                <ol className="list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-[#F4EFEA]/90">
                  {TRIGGER_CHECK.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#B5A99F]">
                  Rupture &amp; Repair
                </h2>
                {REPAIR_SCRIPTS.map((script) => (
                  <div key={script.id} className="space-y-2 rounded-xl border border-[#332A24] bg-[#1E1916] p-4">
                    <p className="text-xs font-medium text-[#E09F67]">{script.situation}</p>
                    <p className="text-xs text-[#B5A99F]">{script.innerReset}</p>
                    <p className="rounded-lg bg-[#14110F] p-2.5 text-xs italic text-[#F4EFEA]">
                      {script.outLoud}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#B5A99F]">
                  You don’t have to do this alone
                </h2>
                {SUPPORT_LINES.map((line) => (
                  <a
                    key={line.id}
                    href={line.href}
                    className="flex min-h-[52px] items-start gap-3 rounded-xl border border-[#332A24] bg-[#1E1916] p-3.5"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#8FA893]" />
                    <span>
                      <span className="block text-sm font-medium text-[#F4EFEA]">{line.label}</span>
                      <span className="mt-0.5 block text-xs text-[#B5A99F]">{line.detail}</span>
                    </span>
                  </a>
                ))}
                <p className="text-[11px] text-[#B5A99F]">{SUPPORT_LINES_NOTE}</p>
              </div>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-[#B5A99F]">{PEDIATRICIAN_DISCLAIMER}</p>
        </div>

        {/* Pinned safety + actions (always visible) */}
        <div className="space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="space-y-1.5 rounded-xl border border-[#8FA893]/30 bg-[#1E1916] p-3">
            <p className="flex gap-2 text-xs leading-relaxed text-[#F4EFEA]/90">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8FA893]" />
              <span>{SAFE_SLEEP_REMINDER}</span>
            </p>
            <p className="text-[11px] leading-relaxed text-[#B5A99F]">{SOS_PINNED_LINE}</p>
          </div>
          <div className="flex gap-2.5">
            {path !== 'triage' && (
              <button
                type="button"
                onClick={() => goTo('triage')}
                className="min-h-[52px] flex-1 rounded-xl border border-[#332A24] bg-[#1E1916] text-sm font-medium text-[#F4EFEA]"
              >
                Switch path
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[52px] flex-1 rounded-xl bg-[#28211D] text-sm font-semibold text-[#F4EFEA]"
            >
              Back to Anchor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
