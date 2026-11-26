import { useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';

interface OnboardingViewProps {
  onOpenSos?: () => void;
}

export function OnboardingView({ onOpenSos }: OnboardingViewProps) {
  const setBabyDob = useAppStore((s) => s.setBabyDob);
  const completeOnboardingWithStage = useAppStore(
    (s) => s.completeOnboardingWithStage,
  );
  const [dob, setDob] = useState('');

  const handleDobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    setBabyDob(dob);
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between gap-8 px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-amber">
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

        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          A steady breath for the hard moments, and one calm practice a day.
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Stage-aware guidance drawn from <span className="text-ink">Hunter, Gather, Parent</span>,{' '}
          <span className="text-ink">Bringing Up Bébé</span>, and{' '}
          <span className="text-ink">Philippa Perry</span>. Private on your device.
        </p>
      </div>

      <div className="space-y-6">
        <form
          onSubmit={handleDobSubmit}
          className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-white/[0.04]"
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
            className="min-h-[52px] w-full rounded-xl bg-amber px-4 text-base font-semibold text-canvas transition active:scale-[0.99] disabled:opacity-40"
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
