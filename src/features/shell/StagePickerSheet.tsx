import { useState } from 'react';
import { X } from 'lucide-react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';
import { useActiveStage } from '../shared/useActiveStage';
import { useDialog } from '../shared/useDialog';

interface StagePickerSheetProps {
  onClose: () => void;
}

export function StagePickerSheet({ onClose }: StagePickerSheetProps) {
  const { activeStage, isBrowsing } = useActiveStage();
  const babyDob = useAppStore((s) => s.babyDob);
  const setBabyDob = useAppStore((s) => s.setBabyDob);
  const setManualStage = useAppStore((s) => s.setManualStage);
  const resetProfile = useAppStore((s) => s.resetProfile);
  const dialogRef = useDialog<HTMLDivElement>(onClose);

  const [dobInput, setDobInput] = useState(babyDob ?? '');
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-picker-title"
        className="w-full max-w-md space-y-4 rounded-t-3xl border-t border-line bg-surface p-5 pb-[max(2rem,env(safe-area-inset-bottom))] outline-none"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-center justify-between">
          <h2 id="stage-picker-title" className="text-base font-semibold text-ink">
            Baby’s Stage &amp; DOB
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close stage settings"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-elevated text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-dob" className="block text-xs text-muted">
            Birth date (stage updates automatically each week)
          </label>
          <div className="flex gap-2">
            <input
              id="edit-dob"
              type="date"
              max={getDateKey()}
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              className="min-h-[48px] flex-1 rounded-xl border border-line bg-canvas px-3 text-base text-ink"
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
              className="min-h-[48px] rounded-xl bg-amber px-4 text-sm font-semibold text-canvas disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Or browse a stage:</span>
            {isBrowsing && (
              <button
                type="button"
                onClick={() => {
                  setManualStage(null);
                  onClose();
                }}
                className="min-h-[44px] px-2 text-xs text-amber"
              >
                Return to my baby’s stage
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
                  aria-pressed={selected}
                  onClick={() => {
                    setManualStage(stage.id);
                    onClose();
                  }}
                  className={`min-h-[52px] rounded-xl border px-3 py-2 text-left text-xs transition ${
                    selected
                      ? 'border-amber bg-amber/15 text-amber'
                      : 'border-line bg-canvas text-ink'
                  }`}
                >
                  <span className="block font-semibold">{stage.label}</span>
                  <span className="block text-xs text-muted">{stage.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {!confirmClear ? (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="min-h-[44px] w-full text-xs text-muted underline underline-offset-4"
          >
            Clear my data from this device
          </button>
        ) : (
          <div className="space-y-2 rounded-xl border border-line bg-canvas p-3.5 text-center">
            <p className="text-xs text-ink">
              Remove baby’s birth date and practice history from this device?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-[44px] flex-1 rounded-lg bg-elevated text-xs font-medium text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetProfile();
                }}
                className="min-h-[44px] flex-1 rounded-lg border border-amber/40 bg-amber/15 text-xs font-semibold text-amber"
              >
                Yes, clear data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
