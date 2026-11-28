import { useEffect, useState } from 'react';
import { History, LifeBuoy } from 'lucide-react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import { listDailyBackups, type DailyBackupSnapshot } from '../../state/dailyBackup';
import { useAppStore } from '../../state/useAppStore';

interface OnboardingViewProps {
  onOpenSos?: () => void;
}

export function OnboardingView({ onOpenSos }: OnboardingViewProps) {
  const setBabyDob = useAppStore((s) => s.setBabyDob);
  const completeOnboardingWithStage = useAppStore(
    (s) => s.completeOnboardingWithStage,
  );
  const restoreFromBackup = useAppStore((s) => s.restoreFromBackup);
  const [dob, setDob] = useState('');
  const [recoverableSnapshot, setRecoverableSnapshot] = useState<DailyBackupSnapshot | null>(null);

  useEffect(() => {
    let active = true;
    listDailyBackups()
      .then((snaps) => {
        if (active && snaps[0]) setRecoverableSnapshot(snaps[0]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleDobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    setBabyDob(dob);
  };

  return (
    <main className="bg-nursery-glow mx-auto flex min-h-dvh max-w-md flex-col justify-between gap-6 px-5 pt-[max(1.75rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="space-y-3.5">
        <span className="inline-flex h-[26px] items-center rounded-full border border-line bg-surface px-3 text-[11px] font-semibold tracking-widest uppercase text-amber">
          <span className="ui-pill-label">Anchor</span>
        </span>

        <h1 className="font-serif text-[27px] leading-snug font-normal tracking-tight text-ink">
          Calm, grounded parenting—for your kid and your marriage.
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Stage-matched daily habits from birth to 3 years—raising a resilient, capable human while
          protecting your partnership and personal life. Private on your device.
        </p>
      </div>

      <div className="space-y-4">
        {recoverableSnapshot && (
          <div className="space-y-2.5 rounded-2xl border border-sage/35 bg-surface p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-sage">
              <History aria-hidden="true" className="h-4 w-4" />
              Previous backup found ({recoverableSnapshot.dateKey})
            </p>
            <button
              type="button"
              onClick={() => restoreFromBackup(recoverableSnapshot.backupJson)}
              className="h-11 w-full rounded-xl bg-sage/20 px-4 text-sm font-semibold text-sage"
            >
              Restore my saved data
            </button>
          </div>
        )}

        <form
          onSubmit={handleDobSubmit}
          className="space-y-3.5 rounded-2xl bg-surface p-5 ring-1 ring-line"
        >
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="baby-dob" className="text-sm font-medium text-ink">
              When was your baby born?
            </label>
            <button
              type="button"
              onClick={() => completeOnboardingWithStage('0-6w')}
              className="relative inline-flex h-[26px] shrink-0 items-center rounded-full border border-amber/35 bg-amber/10 px-2.5 text-[11px] font-medium whitespace-nowrap text-amber transition active:scale-[0.98] after:absolute after:-inset-x-1 after:-inset-y-[9px]"
            >
              <span className="ui-pill-label">Expecting? Start at 0–6w →</span>
            </button>
          </div>
          <input
            id="baby-dob"
            name="babyDob"
            type="date"
            max={getDateKey()}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-base text-ink focus:border-amber focus:outline-none"
          />
          <button
            type="submit"
            disabled={!dob}
            className="h-12 w-full rounded-xl bg-amber px-4 text-sm font-semibold text-on-amber transition active:scale-[0.99] disabled:opacity-40"
          >
            Start with my baby’s stage
          </button>
        </form>

        <div className="space-y-2">
          <p className="text-center text-xs text-muted">Or jump straight to an age:</p>
          <div className="grid grid-cols-4 gap-1.5">
            {STAGES.map((stage) => {
              const shortLabel = stage.label
                .replace(' Weeks', 'w')
                .replace(' Months', 'm')
                .replace(' Years', 'y');
              return (
                <button
                  key={stage.id}
                  type="button"
                  aria-label={`${shortLabel} — ${stage.label} (${stage.subtitle})`}
                  onClick={() => completeOnboardingWithStage(stage.id)}
                  className="min-h-[44px] rounded-xl border border-line bg-surface px-2 py-1.5 text-center text-xs font-medium text-ink transition active:border-amber"
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom-Thumb Escape Hatch for 3 AM Distress */}
        {onOpenSos && (
          <button
            type="button"
            onClick={onOpenSos}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-amber/40 bg-amber/12 px-4 text-xs font-semibold text-amber transition active:scale-[0.99]"
          >
            <LifeBuoy aria-hidden="true" className="h-4 w-4" />
            Need help right now?
          </button>
        )}
      </div>
    </main>
  );
}
