import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Home,
  Moon,
  Share2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AGE_GUIDES } from '../../content/ageGuides';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { STAGES } from '../../content/stages';
import type { AgeGuideSectionId, BookFramework, StageId } from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import { useActiveStage } from '../shared/useActiveStage';

interface ByAgeViewProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

const SECTION_ICONS: Record<AgeGuideSectionId, typeof Sparkles> = {
  developing: Sparkles,
  rhythm: Moon,
  'yes-space': Home,
  grit: Shield,
  'dont-stress': CheckCircle2,
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

  // Sync local preview whenever the user changes their baby's active stage in Settings
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
    <div className="animate-calm-in space-y-5">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-xs tracking-widest uppercase text-muted">3-Minute Cheat Sheet</p>
          <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-ink">
            By Age
          </h1>
        </div>
      </header>

      {/* Stage Strip: Instant peek ahead or behind without losing your baby's saved stage */}
      <div
        role="group"
        aria-label="Browse cheat sheets by age"
        className="no-scrollbar fade-right-mask -mx-5 flex gap-2 overflow-x-auto px-5 pr-10 pb-1"
      >
        {STAGES.map((stage) => {
          const selected = viewedStage.id === stage.id;
          const isHomeStage = activeStage.id === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedStageId(stage.id)}
              className={`min-h-[44px] shrink-0 rounded-full border px-3.5 text-xs font-medium transition ${
                selected
                  ? 'border-amber/70 bg-amber/15 text-amber'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              {stage.label}
              {isHomeStage ? ' · Now' : ''}
            </button>
          );
        })}
      </div>

      {isPeekingOtherStage && (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface/70 px-4 py-2.5 text-xs text-muted">
          <span>
            Previewing <span className="font-medium text-ink">{viewedStage.label}</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedStageId(activeStage.id)}
            className="min-h-[36px] font-medium text-amber"
          >
            Back to {babyName ? `${babyName} (${activeStage.label})` : activeStage.label}
          </button>
        </div>
      )}

      {/* Stage Overview + Key Shift + 1-Tap Spouse Share */}
      <section
        aria-label={`${viewedStage.label} overview`}
        className="space-y-3.5 rounded-3xl bg-surface p-5 ring-1 ring-amber/20"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-amber">
              {viewedStage.label} · {viewedStage.subtitle}
            </p>
            <h2 className="mt-1 font-serif text-xl leading-snug font-normal text-ink">
              {guide.headline}
            </h2>
          </div>
          <button
            type="button"
            aria-label={`Share ${viewedStage.label} cheat sheet`}
            onClick={handleShareGuide}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-elevated text-muted transition active:text-ink"
          >
            {copied ? (
              <Check aria-hidden="true" className="h-4 w-4 text-sage" />
            ) : (
              <Share2 aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="border-l-2 border-amber/60 pl-3.5 text-sm leading-relaxed text-ink/90">
          <span className="font-semibold text-amber">Big shift here: </span>
          {guide.keyShift}
        </p>
      </section>

      {/* 5 Bite-Sized Cards (Strictly 3 Bullets Each) */}
      <div className="space-y-4">
        {guide.sections.map((section) => {
          const Icon = SECTION_ICONS[section.id];
          const isDontStress = section.id === 'dont-stress';
          return (
            <article
              key={section.id}
              className="space-y-3 rounded-3xl bg-surface p-5 ring-1 ring-line"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
                  <Icon
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 ${isDontStress ? 'text-sage' : 'text-amber'}`}
                  />
                  <span>{section.title}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => onOpenFramework?.(section.framework)}
                  className="-my-2 inline-flex min-h-[44px] shrink-0 items-center"
                >
                  <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-muted transition active:text-ink">
                    {FRAMEWORK_LABELS[section.framework]}
                  </span>
                </button>
              </div>

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
