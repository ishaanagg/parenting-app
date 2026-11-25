import { useState } from 'react';
import { X } from 'lucide-react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import { useActiveStage } from '../../state/useActiveStage';
import { useAppStore } from '../../state/useAppStore';

interface StagePickerSheetProps {
  onClose: () => void;
}

export function StagePickerSheet({ onClose }: StagePickerSheetProps) {
  const { activeStage, isOverridden } = useActiveStage();
  const babyDob = useAppStore((s) => s.babyDob);
  const setBabyDob = useAppStore((s) => s.setBabyDob);
  const setManualStage = useAppStore((s) => s.setManualStage);

  const [dobInput, setDobInput] = useState(babyDob ?? '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Baby Stage Settings"
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70"
    >
      <div className="w-full max-w-md space-y-4 rounded-t-3xl border-t border-[#332A24] bg-[#1E1916] p-5 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#F4EFEA]">
            Baby’s Stage &amp; DOB
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close stage settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#28211D] text-[#B5A99F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-dob" className="block text-xs text-[#B5A99F]">
            Birth date (auto-updates stage each week)
          </label>
          <div className="flex gap-2">
            <input
              id="edit-dob"
              type="date"
              max={getDateKey()}
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              className="min-h-[44px] flex-1 rounded-xl border border-[#332A24] bg-[#14110F] px-3 text-sm text-[#F4EFEA]"
            />
            <button
              type="button"
              disabled={!dobInput}
              onClick={() => {
                if (dobInput) {
                  setBabyDob(dobInput);
                  onClose();
                }
              }}
              className="min-h-[44px] rounded-xl bg-[#E09F67] px-4 text-xs font-semibold text-[#14110F] disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B5A99F]">Or browse a stage:</span>
            {isOverridden && babyDob && (
              <button
                type="button"
                onClick={() => {
                  setManualStage(null);
                  onClose();
                }}
                className="text-xs text-[#E09F67]"
              >
                Reset to DOB stage
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((stage) => {
              const selected = activeStage.id === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setManualStage(stage.id);
                    onClose();
                  }}
                  className={`min-h-[48px] rounded-xl border px-3 py-2 text-left text-xs transition ${
                    selected
                      ? 'border-[#E09F67] bg-[#E09F67]/15 text-[#E09F67]'
                      : 'border-[#332A24] bg-[#14110F] text-[#F4EFEA]'
                  }`}
                >
                  <span className="block font-semibold">{stage.label}</span>
                  <span className="block text-[11px] text-[#B5A99F]">
                    {stage.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
