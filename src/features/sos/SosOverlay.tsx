import { useEffect, useState } from 'react';
import { HeartHandshake, Moon, Pause, Play, RotateCcw, ShieldCheck, X } from 'lucide-react';
import {
  CRY_CUES,
  PEDIATRICIAN_DISCLAIMER,
  REPAIR_SCRIPTS,
  SAFE_SLEEP_REMINDER,
} from '../../content/sos';
import { useActiveStage } from '../../state/useActiveStage';

export type SosPath = 'triage' | 'baby' | 'parent';

interface SosOverlayProps {
  initialPath?: 'baby' | 'parent';
  onClose: () => void;
}

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function SosOverlay({ initialPath, onClose }: SosOverlayProps) {
  const { activeStage } = useActiveStage();
  const [path, setPath] = useState<SosPath>(initialPath ?? 'triage');
  const [secondsLeft, setSecondsLeft] = useState(activeStage.laPauseSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(activeStage.laPauseSeconds);
    setTimerRunning(false);
  }, [activeStage.laPauseSeconds, path]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, secondsLeft]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SOS Grounding and Support"
      className="fixed inset-0 z-50 flex flex-col bg-[#14110F] text-[#F4EFEA]"
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between px-5 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#E09F67]">
              Quiet Support · {activeStage.label}
            </p>
            <h1 className="text-lg font-semibold text-[#F4EFEA]">
              {path === 'triage' && 'Take one slow breath.'}
              {path === 'baby' && 'La Pause · 3 AM Companion'}
              {path === 'parent' && 'Reset & Repair'}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close SOS"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#332A24] bg-[#1E1916] text-[#B5A99F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="my-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {path === 'triage' && (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-[#B5A99F]">
                What needs support right now?
              </p>

              <button
                type="button"
                onClick={() => setPath('baby')}
                className="flex min-h-[84px] w-full items-start gap-3.5 rounded-2xl border border-[#332A24] bg-[#1E1916] p-4 text-left transition active:border-[#E09F67]"
              >
                <Moon className="mt-0.5 h-5 w-5 shrink-0 text-[#E09F67]" />
                <div>
                  <span className="block text-base font-semibold text-[#F4EFEA]">
                    Baby is crying / 3 AM wake-up
                  </span>
                  <span className="mt-1 block text-xs text-[#B5A99F]">
                    Start a {formatSeconds(activeStage.laPauseSeconds)} La Pause timer &amp; check cry cues
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPath('parent')}
                className="flex min-h-[84px] w-full items-start gap-3.5 rounded-2xl border border-[#332A24] bg-[#1E1916] p-4 text-left transition active:border-[#E09F67]"
              >
                <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#8FA893]" />
                <div>
                  <span className="block text-base font-semibold text-[#F4EFEA]">
                    I’m overwhelmed / triggered
                  </span>
                  <span className="mt-1 block text-xs text-[#B5A99F]">
                    60s breathing pacer, safe-sleep crib pause, &amp; repair scripts
                  </span>
                </div>
              </button>
            </div>
          )}

          {path === 'baby' && (
            <div className="space-y-4">
              {/* Interactive La Pause Timer */}
              <div className="space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5 text-center">
                <p className="text-xs text-[#B5A99F]">{activeStage.laPauseNote}</p>
                <div className="text-4xl font-semibold tabular-nums tracking-tight text-[#E09F67]">
                  {secondsLeft === 0 ? 'Pause complete' : formatSeconds(secondsLeft)}
                </div>
                <div className="flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#E09F67] px-4 text-sm font-semibold text-[#14110F]"
                  >
                    {timerRunning ? (
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
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(activeStage.laPauseSeconds);
                    }}
                    aria-label="Reset timer"
                    className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#332A24] bg-[#28211D] px-4 text-[#B5A99F]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Cry Communication Cues */}
              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#B5A99F]">
                  What might this cry be communicating?
                </h2>
                {CRY_CUES.map((cue) => (
                  <div
                    key={cue.id}
                    className="rounded-xl border border-[#332A24] bg-[#1E1916] p-3.5"
                  >
                    <p className="text-sm font-medium text-[#F4EFEA]">{cue.label}</p>
                    <p className="mt-1 text-xs text-[#B5A99F]">{cue.meaning}</p>
                    <p className="mt-1.5 text-xs text-[#8FA893]">{cue.nextStep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {path === 'parent' && (
            <div className="space-y-4">
              {/* Breathing Pacer */}
              <div className="flex flex-col items-center space-y-3 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5 text-center">
                <div className="animate-breathe flex h-24 w-24 items-center justify-center rounded-full border border-[#8FA893]/50 bg-[#8FA893]/15">
                  <span className="text-xs font-medium text-[#8FA893]">
                    4s in · 6s out
                  </span>
                </div>
                <p className="text-sm font-medium text-[#F4EFEA]">
                  Your calm is the anchor.
                </p>
                <p className="text-xs leading-relaxed text-[#B5A99F]">
                  If your chest is tight or anger is rising, that’s your nervous system
                  asking for a pause—not a sign you’re failing.
                </p>
              </div>

              {/* Rupture & Repair Scripts */}
              <div className="space-y-2.5">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#B5A99F]">
                  Rupture &amp; Repair
                </h2>
                {REPAIR_SCRIPTS.map((script) => (
                  <div
                    key={script.id}
                    className="space-y-2 rounded-xl border border-[#332A24] bg-[#1E1916] p-4"
                  >
                    <p className="text-xs font-medium text-[#E09F67]">
                      {script.situation}
                    </p>
                    <p className="text-xs text-[#B5A99F]">{script.innerReset}</p>
                    <p className="rounded-lg bg-[#14110F] p-2.5 text-xs italic text-[#F4EFEA]">
                      {script.outLoud}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Always-visible Safe Sleep & Medical Boundary */}
          <div className="space-y-2 rounded-2xl border border-[#8FA893]/30 bg-[#1E1916] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8FA893]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Safe-Sleep Permission
            </div>
            <p className="text-xs leading-relaxed text-[#F4EFEA]/90">
              {SAFE_SLEEP_REMINDER}
            </p>
            <p className="border-t border-[#332A24] pt-2 text-[11px] leading-relaxed text-[#B5A99F]">
              {PEDIATRICIAN_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* Bottom Back / Done */}
        <div className="flex gap-2.5 pt-2 pb-[env(safe-area-inset-bottom)]">
          {path !== 'triage' && (
            <button
              type="button"
              onClick={() => setPath('triage')}
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
  );
}
