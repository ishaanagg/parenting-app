import { useState } from 'react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';

export function OnboardingView() {
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
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-5 py-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#332A24] bg-[#1E1916] px-3 py-1 text-xs text-[#E09F67]">
          Anchor · Night-First Co-Pilot
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#F4EFEA]">
          Calm daily practice, and steady help at 3 AM.
        </h1>
        <p className="text-sm leading-relaxed text-[#B5A99F]">
          Built around <span className="text-[#F4EFEA]">Hunter, Gather, Parent</span>,{' '}
          <span className="text-[#F4EFEA]">Bringing Up Bébé</span>, and{' '}
          <span className="text-[#F4EFEA]">The Book You Wish Your Parents Had Read</span>.
          Everything stays private on your device.
        </p>
      </div>

      <div className="space-y-6 pb-4">
        <form
          onSubmit={handleDobSubmit}
          className="space-y-4 rounded-2xl border border-[#332A24] bg-[#1E1916] p-5"
        >
          <label
            htmlFor="baby-dob"
            className="block text-sm font-medium text-[#F4EFEA]"
          >
            When was your baby born?
          </label>
          <p className="text-xs text-[#B5A99F]">
            We use this only to surface stage-appropriate practices and La Pause timing.
          </p>
          <input
            id="baby-dob"
            type="date"
            max={getDateKey()}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-[#332A24] bg-[#14110F] px-4 text-base text-[#F4EFEA] focus:border-[#E09F67] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!dob}
            className="min-h-[52px] w-full rounded-xl bg-[#E09F67] px-4 text-base font-semibold text-[#14110F] transition active:scale-[0.99] disabled:opacity-40"
          >
            Start with my baby’s stage
          </button>
        </form>

        <div className="space-y-2">
          <p className="text-center text-xs text-[#B5A99F]">
            Or jump straight to a stage:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => completeOnboardingWithStage(stage.id)}
                className="min-h-[40px] rounded-full border border-[#332A24] bg-[#1E1916] px-3.5 text-xs text-[#F4EFEA] transition active:border-[#E09F67]"
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
