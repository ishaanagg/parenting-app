import { STAGES } from '../../content/stages';
import { calculateAgeInWeeks, getStageForWeek } from '../../domain/stageEngine';
import { useAppStore } from '../../state/useAppStore';
import { useNow } from './useNow';

const LAST_STAGE = STAGES[STAGES.length - 1]!;

export function useActiveStage() {
  const now = useNow();
  const babyDob = useAppStore((s) => s.babyDob);
  const manualStageOverride = useAppStore((s) => s.manualStageOverride);

  const ageInWeeks = babyDob ? calculateAgeInWeeks(babyDob, now) : null;
  const dobStage = ageInWeeks !== null ? getStageForWeek(ageInWeeks, STAGES) : null;
  const overrideStage = manualStageOverride
    ? (STAGES.find((s) => s.id === manualStageOverride) ?? null)
    : null;

  const activeStage = overrideStage ?? dobStage ?? STAGES[0]!;

  return {
    activeStage,
    ageInWeeks,
    dobStage,
    /** Parent picked a stage that differs from the DOB-derived one. */
    isBrowsing: overrideStage !== null && dobStage !== null && overrideStage.id !== dobStage.id,
    /** Baby is older than the content currently covers. */
    isBeyondContent: ageInWeeks !== null && ageInWeeks >= LAST_STAGE.maxWeeks,
  };
}
