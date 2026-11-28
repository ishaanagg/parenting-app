import { useMemo, useState } from 'react';
import {
  Check,
  ChevronRight,
  Heart,
  Pin,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { COUPLE_CHECKIN_PROMPTS, HOUSE_RULE_PRESETS } from '../../content/parentsContent';
import { getParentWeekKey } from '../../domain/stageEngine';
import {
  PERSONAL_TIME_CHIPS,
  type BookFramework,
  type PersonalTimeChipId,
} from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import { PhilosophyTagButton, ShareIconButton } from '../shared/uiPrimitives';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';

interface ParentsViewProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

const EMPTY_CHIPS: readonly PersonalTimeChipId[] = Object.freeze([]);

export function ParentsView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: ParentsViewProps) {
  const now = useNow();
  const weekKey = getParentWeekKey(now);
  const { activeStage } = useActiveStage();

  const parentName = useAppStore((s) => s.parentName);
  const partnerName = useAppStore((s) => s.partnerName);
  const pinnedHouseRuleIds = useAppStore((s) => s.pinnedHouseRuleIds);
  const customHouseRules = useAppStore((s) => s.customHouseRules);
  const couplePromptOffset = useAppStore((s) => s.couplePromptOffset);
  const coupleCheckInByWeek = useAppStore((s) => s.coupleCheckInByWeek);
  const personalTimeByWeek = useAppStore((s) => s.personalTimeByWeek);

  const togglePinnedHouseRule = useAppStore((s) => s.togglePinnedHouseRule);
  const addCustomHouseRule = useAppStore((s) => s.addCustomHouseRule);
  const removeCustomHouseRule = useAppStore((s) => s.removeCustomHouseRule);
  const nextCouplePrompt = useAppStore((s) => s.nextCouplePrompt);
  const toggleCoupleCheckIn = useAppStore((s) => s.toggleCoupleCheckIn);
  const togglePersonalTimeChip = useAppStore((s) => s.togglePersonalTimeChip);

  const [customRuleInput, setCustomRuleInput] = useState('');
  const [rulesCopied, setRulesCopied] = useState(false);

  const selfLabel = parentName || 'You';
  const spouseLabel = partnerName || 'Spouse';
  const missingNames = !parentName || !partnerName;

  const stagePresets = useMemo(
    () => HOUSE_RULE_PRESETS.filter((preset) => preset.stages.includes(activeStage.id)),
    [activeStage.id],
  );

  const pinnedPresets = useMemo(
    () => HOUSE_RULE_PRESETS.filter((preset) => pinnedHouseRuleIds.includes(preset.id)),
    [pinnedHouseRuleIds],
  );

  const unpinnedPresets = useMemo(
    () => stagePresets.filter((preset) => !pinnedHouseRuleIds.includes(preset.id)),
    [pinnedHouseRuleIds, stagePresets],
  );

  const allActiveRuleStrings = useMemo(
    () => [...pinnedPresets.map((p) => p.rule), ...customHouseRules],
    [customHouseRules, pinnedPresets],
  );

  const hasPinnedRules = allActiveRuleStrings.length > 0;

  const promptIndex = couplePromptOffset % COUPLE_CHECKIN_PROMPTS.length;
  const activePrompt = COUPLE_CHECKIN_PROMPTS[promptIndex]!;
  const checkedInThisWeek = coupleCheckInByWeek[weekKey] === true;

  const weekChips = personalTimeByWeek[weekKey];
  const selfChips = weekChips?.self ?? EMPTY_CHIPS;
  const partnerChips = weekChips?.partner ?? EMPTY_CHIPS;

  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRuleInput.trim()) return;
    addCustomHouseRule(customRuleInput);
    setCustomRuleInput('');
  };

  const handleShareRules = () => {
    if (allActiveRuleStrings.length === 0) return;
    const text = [
      'Our Family House Rules (United Front):',
      ...allActiveRuleStrings.map((r) => `• ${r}`),
    ].join('\n');

    shareOrCopy('Our House Rules', text).then((res) => {
      if (res === 'copied') {
        setRulesCopied(true);
        window.setTimeout(() => setRulesCopied(false), 1800);
      }
    });
  };

  const customRuleForm = (
    <form onSubmit={handleAddCustomRule} className="space-y-1.5 pt-1">
      <label htmlFor="custom-house-rule" className="block text-xs text-muted">
        Add your own house rule (optional)
      </label>
      <div className="flex gap-2">
        <input
          id="custom-house-rule"
          name="customHouseRule"
          type="text"
          maxLength={120}
          autoComplete="off"
          enterKeyHint="done"
          placeholder="e.g., Toys in basket before bath"
          value={customRuleInput}
          onChange={(e) => setCustomRuleInput(e.target.value)}
          className="h-11 flex-1 rounded-xl border border-line bg-canvas px-3 text-base text-ink placeholder:text-muted/50 focus:border-amber focus:outline-none"
        />
        <button
          type="submit"
          disabled={!customRuleInput.trim()}
          className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-line bg-elevated/85 px-4 text-xs font-semibold whitespace-nowrap text-ink transition active:border-amber disabled:opacity-40"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Add</span>
        </button>
      </div>
    </form>
  );

  return (
    <div className="animate-calm-in space-y-4">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted">
            United Front &amp; Whole Self
          </p>
          <h1 className="mt-1 font-serif text-[26px] leading-tight font-normal tracking-tight text-ink">
            Parents
          </h1>
        </div>
      </header>

      {/* 1. 5-Min Weekly Couple Check-In */}
      <section
        aria-labelledby="couple-checkin-heading"
        className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
      >
        <div className="flex min-h-[26px] items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-amber">
            <Heart aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="ui-pill-label">Weekly Ritual</span>
          </span>
          <PhilosophyTagButton
            framework={activePrompt.framework}
            onOpenFramework={onOpenFramework}
          />
        </div>

        <h2
          id="couple-checkin-heading"
          className="font-serif text-[20px] leading-snug font-normal text-ink"
        >
          5-Min Weekly Check-In
        </h2>

        <div className="space-y-3 text-[15px] leading-relaxed">
          <p className="border-l-2 border-amber/55 pl-3.5 text-ink">
            <span className="font-semibold text-amber">Us first: </span>
            {activePrompt.connectionQuestion}
          </p>
          <p className="border-l-2 border-sage/55 pl-3.5 text-sm text-muted">
            <span className="font-semibold text-sage">Fair load: </span>
            {activePrompt.ownershipCheck}
          </p>
        </div>

        <p className="text-xs text-muted">
          Close with a 6-second kiss—long enough to shift out of co-manager mode.
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-pressed={checkedInThisWeek}
            onClick={() => toggleCoupleCheckIn(weekKey)}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold whitespace-nowrap transition active:scale-[0.98] ${
              checkedInThisWeek
                ? 'border border-sage/45 bg-sage/15 text-sage'
                : 'bg-amber text-on-amber'
            }`}
          >
            <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>{checkedInThisWeek ? 'Checked in this week' : 'Mark checked in'}</span>
          </button>

          <button
            type="button"
            onClick={nextCouplePrompt}
            aria-label="Next check-in prompt"
            className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated/80 px-3.5 text-xs font-medium whitespace-nowrap text-muted transition active:scale-[0.98] active:border-amber active:text-ink"
          >
            <RefreshCw aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span>Next</span>
            <span className="tabular-nums text-muted/80">
              {promptIndex + 1}/{COUPLE_CHECKIN_PROMPTS.length}
            </span>
          </button>
        </div>
      </section>

      {/* 2. Our House Rules */}
      <section
        aria-labelledby="house-rules-heading"
        className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
      >
        <div className="flex min-h-[36px] items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-amber">
            <Pin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="ui-pill-label truncate">United Front · {activeStage.label}</span>
          </span>
          {hasPinnedRules && (
            <ShareIconButton
              copied={rulesCopied}
              label="Share our house rules"
              onShare={handleShareRules}
            />
          )}
        </div>

        <div>
          <h2
            id="house-rules-heading"
            className="font-serif text-[20px] leading-snug font-normal text-ink"
          >
            Our House Rules
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Hold 1–3 core boundaries identically so neither parent has to play bad cop.
          </p>
        </div>

        {/* Active Pinned Presets + Custom Rules */}
        {hasPinnedRules && (
          <div className="space-y-2">
            {pinnedPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={true}
                onClick={() => togglePinnedHouseRule(preset.id)}
                className="flex min-h-[52px] w-full items-start gap-3 rounded-xl border border-amber/55 bg-amber/10 p-3.5 text-left transition active:scale-[0.99]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber bg-amber text-on-amber"
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium leading-snug text-ink">
                    {preset.rule}
                  </span>
                  <span className="block text-xs text-muted">{preset.why}</span>
                </span>
              </button>
            ))}

            {customHouseRules.map((rule) => (
              <div
                key={rule}
                className="flex items-center justify-between gap-2 rounded-xl border border-amber/55 bg-amber/10 px-3.5 py-2.5 text-sm text-ink"
              >
                <span className="font-medium">{rule}</span>
                <button
                  type="button"
                  aria-label={`Remove custom rule ${rule}`}
                  onClick={() => removeCustomHouseRule(rule)}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition active:text-amber after:absolute after:-inset-1"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tuck remaining suggestions cleanly once ≥1 rule is pinned */}
        {hasPinnedRules ? (
          <details className="group border-t border-line/65 pt-2.5">
            <summary className="flex min-h-[36px] cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-muted select-none active:text-ink [&::-webkit-details-marker]:hidden">
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-amber transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
              />
              <span>
                Add or browse suggested rules ({unpinnedPresets.length} more for {activeStage.label})
              </span>
            </summary>
            <div className="space-y-2.5 pt-2.5">
              {unpinnedPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={false}
                  onClick={() => togglePinnedHouseRule(preset.id)}
                  className="flex min-h-[52px] w-full items-start gap-3 rounded-xl border border-line bg-canvas/65 p-3.5 text-left text-ink/90 transition active:scale-[0.99]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-transparent"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium leading-snug">{preset.rule}</span>
                    <span className="block text-xs text-muted">{preset.why}</span>
                  </span>
                </button>
              ))}
              {customRuleForm}
            </div>
          </details>
        ) : (
          <div className="space-y-2.5">
            {unpinnedPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={false}
                onClick={() => togglePinnedHouseRule(preset.id)}
                className="flex min-h-[52px] w-full items-start gap-3 rounded-xl border border-line bg-canvas/65 p-3.5 text-left text-ink/90 transition active:scale-[0.99]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-transparent"
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium leading-snug">{preset.rule}</span>
                  <span className="block text-xs text-muted">{preset.why}</span>
                </span>
              </button>
            ))}
            {customRuleForm}
          </div>
        )}
      </section>

      {/* 3. Weekly Personal Time ("Unicorn Space") */}
      <section
        aria-labelledby="personal-time-heading"
        className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
      >
        <div className="flex min-h-[26px] items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-sage">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="ui-pill-label">Whole Self</span>
          </span>
          {missingNames && onOpenStagePicker && (
            <button
              type="button"
              onClick={onOpenStagePicker}
              className="relative inline-flex h-[26px] shrink-0 items-center rounded-full border border-amber/35 bg-amber/10 px-2.5 text-[11px] font-medium whitespace-nowrap text-amber transition active:scale-[0.98] after:absolute after:-inset-x-1 after:-inset-y-[9px]"
            >
              <span className="ui-pill-label">Add names →</span>
            </button>
          )}
        </div>

        <div>
          <h2
            id="personal-time-heading"
            className="font-serif text-[20px] leading-snug font-normal text-ink"
          >
            This Week’s Personal Time
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            Protect guilt-free solo blocks for both of you (resets Mondays—zero streaks).
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Self Row */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-amber">
              {selfLabel}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PERSONAL_TIME_CHIPS.map((chip) => {
                const active = selfChips.includes(chip.id);
                return (
                  <button
                    key={`self-${chip.id}`}
                    type="button"
                    aria-label={`${chip.label} for ${selfLabel}`}
                    aria-pressed={active}
                    onClick={() => togglePersonalTimeChip('self', chip.id, weekKey)}
                    className={`h-11 rounded-xl border px-3 text-xs font-medium whitespace-nowrap transition active:scale-[0.98] ${
                      active
                        ? 'border-amber/65 bg-amber/15 text-amber'
                        : 'border-line bg-canvas/75 text-muted active:text-ink'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Partner Row */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-sage">
              {spouseLabel}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PERSONAL_TIME_CHIPS.map((chip) => {
                const active = partnerChips.includes(chip.id);
                return (
                  <button
                    key={`partner-${chip.id}`}
                    type="button"
                    aria-label={`${chip.label} for ${spouseLabel}`}
                    aria-pressed={active}
                    onClick={() => togglePersonalTimeChip('partner', chip.id, weekKey)}
                    className={`h-11 rounded-xl border px-3 text-xs font-medium whitespace-nowrap transition active:scale-[0.98] ${
                      active
                        ? 'border-sage/65 bg-sage/15 text-sage'
                        : 'border-line bg-canvas/75 text-muted active:text-ink'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="border-l-2 border-sage/55 pl-3 text-xs leading-relaxed text-muted">
          A brief wave of guilt when stepping out is normal—kids grow grounded watching two
          energized, curious adults.
        </p>
      </section>
    </div>
  );
}
