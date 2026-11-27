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
    <main className="bg-nursery-glow mx-auto flex min-h-dvh max-w-md flex-col justify-between gap-8 px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs tracking-wide text-amber">
            Anchor
          </div>
          {onOpenSos && (
            <button
              type="button"
              onClick={onOpenSos}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-amber/40 bg-amber/15 px-3.5 text-xs font-semibold text-amber"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              Need help right now?
            </button>
          )}
        </div>

        <h1 className="font-serif text-[28px] leading-snug font-normal tracking-tight text-ink">
          Calm, grounded parenting—for your kid and your marriage.
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Stage-matched daily habits from birth to 3 years—raising a resilient, capable human while
          protecting your partnership and personal life. Private on your device.
        </p>
      </div>

      <div className="space-y-6">
        {recoverableSnapshot && (
          <div className="space-y-2.5 rounded-2xl border border-sage/35 bg-surface p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-sage">
              <History className="h-4 w-4" />
              Previous backup found ({recoverableSnapshot.dateKey})
            </p>
            <button
              type="button"
              onClick={() => restoreFromBackup(recoverableSnapshot.backupJson)}
              className="min-h-[48px] w-full rounded-xl bg-sage/20 px-4 text-sm font-semibold text-sage"
            >
              Restore my saved data
            </button>
          </div>
        )}

        <form
          onSubmit={handleDobSubmit}
          className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
        >
          <label htmlFor="baby-dob" className="block text-[15px] font-medium text-ink">
            When was your baby born?
          </label>
          <p className="text-sm text-muted">
            Used only to match your baby’s stage automatically each week.
          </p>
          <input
            id="baby-dob"
            type="date"
            max={getDateKey()}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-line bg-canvas px-4 text-base text-ink focus:border-amber focus:outline-none"
          />
          <button
            type="submit"
            disabled={!dob}
            className="min-h-[52px] w-full rounded-xl bg-amber px-4 text-base font-semibold text-on-amber transition active:scale-[0.99] disabled:opacity-40"
          >
            Start with my baby’s stage
          </button>
        </form>

        <div className="space-y-2.5">
          <p className="text-center text-xs text-muted">Or jump straight to a stage:</p>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => completeOnboardingWithStage(stage.id)}
                className="min-h-[52px] rounded-xl border border-line bg-surface px-3 py-2 text-left text-xs transition active:border-amber"
              >
                <span className="block font-semibold text-ink">{stage.label}</span>
                <span className="block text-xs text-muted">{stage.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
