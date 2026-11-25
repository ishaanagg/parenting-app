import { STAGES } from '../content/stages';
import { calculateAgeInWeeks, getStageForWeek } from '../domain/stageEngine';
import { useAppStore } from '../state/useAppStore';

export function useActiveStage() {
  const babyDob = useAppStore((s) => s.babyDob);
  const manualStageOverride = useAppStore((s) => s.manualStageOverride);

  const ageInWeeks = babyDob ? calculateAgeInWeeks(babyDob) : null;
  const computedStage =
    ageInWeeks !== null ? getStageForWeek(ageInWeeks, STAGES) : STAGES[0]!;

  const activeStage = manualStageOverride
    ? STAGES.find((s) => s.id === manualStageOverride) ?? computedStage
    : computedStage;

  return {
    activeStage,
    ageInWeeks,
    isOverridden: manualStageOverride !== null,
  };
}
