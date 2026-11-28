import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Home,
  Moon,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AGE_GUIDES } from '../../content/ageGuides';
import { STAGES } from '../../content/stages';
import type { AgeGuideSectionId, BookFramework, StageId } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import {
  FilterChip,
  PhilosophyTagButton,
  ShareIconButton,
} from '../shared/uiPrimitives';
import { useActiveStage } from '../shared/useActiveStage';

interface ByAgeViewProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

const SECTION_META: Record<
  AgeGuideSectionId,
  { Icon: typeof Sparkles; kicker: string }
> = {
  developing: { Icon: Sparkles, kicker: 'Development' },
  rhythm: { Icon: Moon, kicker: 'Sleep & Rhythm' },
  'yes-space': { Icon: Home, kicker: 'Environment' },
  grit: { Icon: Shield, kicker: 'Character & Grit' },
  'dont-stress': { Icon: CheckCircle2, kicker: 'Reassurance' },
};

export function ByAgeView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: ByAgeViewProps) {
  const { activeStage } = useActiveStage();
  const babyName = useAppStore((s) => s.babyName);
  const [selectedStageId, setSelectedStageId] = useState<StageId>(activeStage.id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedStageId(activeStage.id);
  }, [activeStage.id]);

  const viewedStage = STAGES.find((s) => s.id === selectedStageId) ?? activeStage;
  const guide = AGE_GUIDES[viewedStage.id];
  const isPeekingOtherStage = viewedStage.id !== activeStage.id;

  const handleShareGuide = () => {
    const body = [
      `${viewedStage.label} (${viewedStage.subtitle}) — ${guide.headline}`,
      `Key shift: ${guide.keyShift}`,
      ...guide.sections.map(
        (sec) => `\n${sec.title}:\n${sec.bullets.map((b) => `• ${b}`).join('\n')}`,
      ),
    ].join('\n');

    shareOrCopy(`Anchor · ${viewedStage.label} Cheat Sheet`, body).then((res) => {
      if (res === 'copied') {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    });
  };

  return (
    <div className="animate-calm-in space-y-4">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted">
            3-Minute Cheat Sheet
          </p>
          <h1 className="mt-1 font-serif text-[26px] leading-tight font-normal tracking-tight text-ink">
            By Age
          </h1>
        </div>
      </header>

      {/* Standardized 34px Capsule Stage Strip */}
      <div
        role="group"
        aria-label="Browse cheat sheets by age"
        className="no-scrollbar fade-right-mask -mx-5 flex snap-x snap-proximity gap-2 overflow-x-auto px-5 py-1.5 pr-10"
      >
        {STAGES.map((stage) => {
          const selected = viewedStage.id === stage.id;
          const isHomeStage = activeStage.id === stage.id;
          return (
            <FilterChip
              key={stage.id}
              active={selected}
              onClick={() => setSelectedStageId(stage.id)}
            >
              {stage.label}
              {isHomeStage ? ' · Now' : ''}
            </FilterChip>
          );
        })}
      </div>

      {isPeekingOtherStage && (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface/80 px-4 py-2.5 text-xs text-muted">
          <span>
            Previewing <span className="font-medium text-ink">{viewedStage.label}</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedStageId(activeStage.id)}
            className="relative min-h-[36px] font-medium whitespace-nowrap text-amber after:absolute after:-inset-y-1 after:inset-x-0"
          >
            Back to {babyName ? `${babyName} (${activeStage.label})` : activeStage.label}
          </button>
        </div>
      )}

      {/* Stage Overview + Key Shift + Standardized 36px Share Circle */}
      <section
        aria-label={`${viewedStage.label} overview`}
        className="space-y-3.5 rounded-2xl bg-surface p-5 ring-1 ring-amber/25"
      >
        <div className="flex min-h-[36px] items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[11px] font-semibold tracking-wider uppercase text-amber">
            {viewedStage.label} · {viewedStage.subtitle}
          </p>
          <ShareIconButton
            copied={copied}
            label={`Share ${viewedStage.label} cheat sheet`}
            onShare={handleShareGuide}
          />
        </div>

        <h2 className="font-serif text-[20px] leading-snug font-normal text-ink">
          {guide.headline}
        </h2>

        <p className="border-l-2 border-amber/60 pl-3.5 text-sm leading-relaxed text-ink/90">
          <span className="font-semibold text-amber">Big shift here: </span>
          {guide.keyShift}
        </p>
      </section>

      {/* 5 Domain Cards: Identical 26px Top Metadata Row + Full-Width Heading */}
      <div className="space-y-4">
        {guide.sections.map((section) => {
          const { Icon, kicker } = SECTION_META[section.id];
          const isDontStress = section.id === 'dont-stress';
          return (
            <article
              key={section.id}
              className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-line"
            >
              <div className="flex min-h-[26px] items-center justify-between gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase ${
                    isDontStress ? 'text-sage' : 'text-amber'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="ui-pill-label">{kicker}</span>
                </span>
                <PhilosophyTagButton
                  framework={section.framework}
                  onOpenFramework={onOpenFramework}
                />
              </div>

              <h2 className="font-serif text-[20px] leading-snug font-normal text-ink">
                {section.title}
              </h2>

              <ul className="space-y-2.5 text-[15px] leading-relaxed text-ink/90">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        isDontStress ? 'bg-sage' : 'bg-amber/80'
                      }`}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
