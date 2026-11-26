import { useRef, useState } from 'react';
import { Check, Copy, Download, Moon, Sun, Sunrise, Upload, X } from 'lucide-react';
import { STAGES } from '../../content/stages';
import { getDateKey } from '../../domain/stageEngine';
import type { ThemePreference } from '../../domain/types';
import { createBackupJson, useAppStore } from '../../state/useAppStore';
import { useActiveStage } from '../shared/useActiveStage';
import { useDialog } from '../shared/useDialog';

interface SettingsSheetProps {
  onClose: () => void;
}

export function SettingsSheet({ onClose }: SettingsSheetProps) {
  const { activeStage, isBrowsing } = useActiveStage();
  const parentName = useAppStore((s) => s.parentName);
  const babyName = useAppStore((s) => s.babyName);
  const babyDob = useAppStore((s) => s.babyDob);
  const themePreference = useAppStore((s) => s.themePreference);
  const setParentName = useAppStore((s) => s.setParentName);
  const setBabyName = useAppStore((s) => s.setBabyName);
  const setBabyDob = useAppStore((s) => s.setBabyDob);
  const setManualStage = useAppStore((s) => s.setManualStage);
  const setThemePreference = useAppStore((s) => s.setThemePreference);
  const restoreFromBackup = useAppStore((s) => s.restoreFromBackup);
  const resetProfile = useAppStore((s) => s.resetProfile);

  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parentInput, setParentInput] = useState(parentName);
  const [babyInput, setBabyInput] = useState(babyName);
  const [dobInput, setDobInput] = useState(babyDob ?? '');
  const [savedNotice, setSavedNotice] = useState(false);

  const [copiedNotice, setCopiedNotice] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreText, setRestoreText] = useState('');
  const [restoreStatus, setRestoreStatus] = useState<{
    kind: 'ok' | 'err';
    message: string;
  } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setParentName(parentInput);
    setBabyName(babyInput);
    setBabyDob(dobInput || null);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleDownloadBackup = () => {
    const json = createBackupJson(useAppStore.getState());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anchor-backup-${getDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBackup = async () => {
    const json = createBackupJson(useAppStore.getState());
    try {
      await navigator.clipboard.writeText(json);
      setCopiedNotice(true);
      window.setTimeout(() => setCopiedNotice(false), 2000);
    } catch {
      setRestoreStatus({
        kind: 'err',
        message: 'Clipboard unavailable—use Download backup instead.',
      });
    }
  };

  const applyRestore = (raw: string) => {
    const res = restoreFromBackup(raw);
    if (res.ok) {
      const next = useAppStore.getState();
      setParentInput(next.parentName);
      setBabyInput(next.babyName);
      setDobInput(next.babyDob ?? '');
      setRestoreText('');
      setRestoreOpen(false);
      setRestoreStatus({ kind: 'ok', message: 'Backup restored on this device.' });
    } else {
      setRestoreStatus({ kind: 'err', message: res.error });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyRestore(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
        aria-labelledby="settings-title"
        className="max-h-[90dvh] w-full max-w-md space-y-5 overflow-y-auto rounded-t-3xl border-t border-line bg-surface p-5 pb-[max(2rem,env(safe-area-inset-bottom))] outline-none"
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-line" aria-hidden="true" />

        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-base font-semibold text-ink">
            Settings &amp; Backup
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-elevated text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile: Your Name, Baby Name, Baby DOB */}
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label htmlFor="settings-parent-name" className="block text-xs text-muted">
                Your name
              </label>
              <input
                id="settings-parent-name"
                type="text"
                maxLength={40}
                placeholder="Optional"
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-line bg-canvas px-3 text-base text-ink placeholder:text-muted/50 focus:border-amber focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="settings-baby-name" className="block text-xs text-muted">
                Baby’s name
              </label>
              <input
                id="settings-baby-name"
                type="text"
                maxLength={40}
                placeholder="Optional"
                value={babyInput}
                onChange={(e) => setBabyInput(e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-line bg-canvas px-3 text-base text-ink placeholder:text-muted/50 focus:border-amber focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-dob" className="block text-xs text-muted">
              Baby’s birth date (stage updates automatically each week)
            </label>
            <div className="flex gap-2">
              <input
                id="edit-dob"
                type="date"
                max={getDateKey()}
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="min-h-[48px] flex-1 rounded-xl border border-line bg-canvas px-3 text-base text-ink focus:border-amber focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-amber px-4 text-sm font-semibold text-on-amber"
              >
                {savedNotice ? (
                  <>
                    <Check className="h-4 w-4" /> Saved
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Baby Stage Selector */}
        <div className="space-y-2 border-t border-line pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Baby’s stage</span>
            {isBrowsing && (
              <button
                type="button"
                onClick={() => setManualStage(null)}
                className="min-h-[44px] px-2 text-xs text-amber"
              >
                Return to DOB stage
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
                  onClick={() => setManualStage(stage.id)}
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

        {/* Appearance: Auto / Day / Night */}
        <div className="space-y-2 border-t border-line pt-4">
          <span className="block text-xs font-medium text-muted">
            Appearance (Auto switches to Night from 9 PM–6 AM)
          </span>
          <div role="group" aria-label="Appearance theme" className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'auto', label: 'Auto', Icon: Sunrise },
                { id: 'day', label: 'Day', Icon: Sun },
                { id: 'night', label: 'Night', Icon: Moon },
              ] as { id: ThemePreference; label: string; Icon: typeof Sun }[]
            ).map(({ id, label, Icon }) => {
              const selected = themePreference === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setThemePreference(id)}
                  className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border text-xs font-medium transition ${
                    selected
                      ? 'border-amber bg-amber/15 text-amber'
                      : 'border-line bg-canvas text-muted'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Local Data Backup & Recovery */}
        <div className="space-y-2.5 border-t border-line pt-4">
          <div>
            <h3 className="text-xs font-medium text-ink">Backup &amp; recovery</h3>
            <p className="mt-0.5 text-xs text-muted">
              Your data is mirrored automatically in device storage. Save a copy before switching
              phones or clearing browser data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-line bg-canvas px-3 text-xs font-medium text-ink"
            >
              <Download className="h-3.5 w-3.5 text-amber" />
              Download backup
            </button>
            <button
              type="button"
              onClick={handleCopyBackup}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-line bg-canvas px-3 text-xs font-medium text-ink"
            >
              {copiedNotice ? (
                <>
                  <Check className="h-3.5 w-3.5 text-sage" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-amber" /> Copy backup
                </>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated px-3 text-xs font-medium text-muted"
            >
              <Upload className="h-3.5 w-3.5" />
              Restore from file
            </button>
            <button
              type="button"
              onClick={() => setRestoreOpen((v) => !v)}
              className="min-h-[44px] rounded-xl border border-line bg-elevated px-3 text-xs font-medium text-muted"
            >
              {restoreOpen ? 'Hide paste' : 'Paste backup'}
            </button>
          </div>

          {restoreOpen && (
            <div className="space-y-2 rounded-xl border border-line bg-canvas p-3">
              <textarea
                rows={3}
                value={restoreText}
                onChange={(e) => setRestoreText(e.target.value)}
                placeholder="Paste your copied Anchor backup JSON here..."
                className="w-full rounded-lg border border-line bg-surface p-2 text-xs text-ink placeholder:text-muted/50 focus:border-amber focus:outline-none"
              />
              <button
                type="button"
                disabled={!restoreText.trim()}
                onClick={() => applyRestore(restoreText)}
                className="min-h-[44px] w-full rounded-lg bg-amber text-xs font-semibold text-on-amber disabled:opacity-40"
              >
                Restore pasted backup
              </button>
            </div>
          )}

          {restoreStatus && (
            <p
              role="status"
              className={`text-xs ${restoreStatus.kind === 'ok' ? 'text-sage' : 'text-amber'}`}
            >
              {restoreStatus.message}
            </p>
          )}
        </div>

        {/* Clear Data */}
        <div className="border-t border-line pt-2">
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
                Remove names, birth date, and practice history from this device?
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
    </div>
  );
}
