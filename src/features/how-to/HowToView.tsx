import { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronRight,
  HeartHandshake,
  Moon,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { FRAMEWORK_LABELS } from '../../content/frameworks';
import { HOW_TO_CATEGORY_LABELS, HOW_TO_GUIDES } from '../../content/howToGuides';
import { filterHowToGuides, isNightHours } from '../../domain/stageEngine';
import {
  HOW_TO_CATEGORIES,
  type BookFramework,
  type HowToCategoryId,
  type HowToGuide,
} from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';

interface HowToViewProps {
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

type FilterId = HowToCategoryId | 'all' | 'saved';

export function HowToView({
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: HowToViewProps) {
  const now = useNow();
  const { activeStage } = useActiveStage();
  const savedCardIds = useAppStore((s) => s.savedCardIds);
  const toggleSavedCard = useAppStore((s) => s.toggleSavedCard);

  const [selectedFilter, setSelectedFilter] = useState<FilterId>(() =>
    isNightHours(now) ? 'sleep' : 'all',
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stageGuides = useMemo(
    () => HOW_TO_GUIDES.filter((g) => g.stages.includes(activeStage.id)),
    [activeStage.id],
  );

  const savedHowToGuides = useMemo(
    () => HOW_TO_GUIDES.filter((g) => savedCardIds.includes(g.id)),
    [savedCardIds],
  );

  const availableCategories = useMemo(
    () =>
      HOW_TO_CATEGORIES.filter((cat) =>
        stageGuides.some((guide) => guide.categories.includes(cat)),
      ),
    [stageGuides],
  );

  const filters = useMemo(() => {
    const items: { id: FilterId; label: string }[] = [{ id: 'all', label: 'All' }];
    if (savedHowToGuides.length > 0) {
      items.push({ id: 'saved', label: `Saved (${savedHowToGuides.length})` });
    }
    for (const cat of availableCategories) {
      items.push({ id: cat, label: HOW_TO_CATEGORY_LABELS[cat] });
    }
    return items;
  }, [availableCategories, savedHowToGuides.length]);

  const effectiveFilter: FilterId =
    (selectedFilter === 'saved' && savedHowToGuides.length === 0) ||
    (selectedFilter !== 'all' &&
      selectedFilter !== 'saved' &&
      !availableCategories.includes(selectedFilter))
      ? 'all'
      : selectedFilter;

  const visibleGuides =
    effectiveFilter === 'saved'
      ? savedHowToGuides
      : filterHowToGuides({
          stageId: activeStage.id,
          category: effectiveFilter,
          guides: HOW_TO_GUIDES,
        });

  const handleShare = (guide: HowToGuide) => {
    const lines = [
      `${guide.title} (${activeStage.label})`,
      `When: ${guide.whenToUse}`,
      '',
      ...guide.quickSteps.map((step, idx) => `${idx + 1}. ${step}`),
    ];
    if (guide.sayOutLoud) {
      lines.push('', `Say out loud: ${guide.sayOutLoud}`);
    }
    if (guide.safetyNote) {
      lines.push('', `Safety: ${guide.safetyNote}`);
    }

    shareOrCopy(guide.title, lines.join('\n')).then((res) => {
      if (res === 'copied') {
        setCopiedId(guide.id);
        window.setTimeout(() => setCopiedId(null), 1800);
      }
    });
  };

  return (
    <div className="animate-calm-in space-y-5">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-xs tracking-widest uppercase text-muted">
            10-Sec Steps · 9 PM Debrief
          </p>
          <h1 className="mt-1 font-serif text-2xl font-normal tracking-tight text-ink">
            How-To
          </h1>
          <p className="mt-1 text-sm text-muted">
            Fast steps on top for quick lookup; tap below for why it happens and exact scripts.
          </p>
        </div>
      </header>

      <div
        role="group"
        aria-label="Filter guides by situation"
        className="no-scrollbar fade-right-mask -mx-5 flex gap-2 overflow-x-auto px-5 pr-10 pb-1"
      >
        {filters.map((filter) => {
          const active = effectiveFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedFilter(filter.id)}
              className={`min-h-[44px] shrink-0 rounded-full border px-4 text-xs font-medium transition ${
                active
                  ? 'border-amber/70 bg-amber/15 text-amber'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {visibleGuides.map((guide) => {
          const isSaved = savedCardIds.includes(guide.id);
          return (
            <article
              key={guide.id}
              className="space-y-3.5 rounded-3xl bg-surface p-5 ring-1 ring-line"
            >
              {/* Top Meta: Theme Pill + Optional Guardrail Badge + Bookmark + Share */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenFramework?.(guide.framework)}
                    className="-my-2 inline-flex min-h-[44px] items-center"
                  >
                    <span className="rounded-full bg-elevated px-2.5 py-1 text-xs text-amber">
                      {FRAMEWORK_LABELS[guide.framework]}
                    </span>
                  </button>
                  {guide.badge && (
                    <span className="rounded-full border border-sage/35 bg-sage/10 px-2.5 py-0.5 text-[11px] font-medium text-sage">
                      {guide.badge}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={
                      isSaved ? `Remove bookmark for ${guide.title}` : `Bookmark ${guide.title}`
                    }
                    aria-pressed={isSaved}
                    onClick={() => toggleSavedCard(guide.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition active:text-amber"
                  >
                    <Bookmark
                      aria-hidden="true"
                      className={`h-4 w-4 ${isSaved ? 'fill-amber text-amber' : ''}`}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label={`Share ${guide.title}`}
                    onClick={() => handleShare(guide)}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition active:text-ink"
                  >
                    {copiedId === guide.id ? (
                      <Check aria-hidden="true" className="h-4 w-4 text-sage" />
                    ) : (
                      <Share2 aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Title + When To Use */}
              <div>
                <h2 className="font-serif text-xl leading-snug font-normal text-ink">
                  {guide.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">{guide.whenToUse}</p>
              </div>

              {/* 10-Second Ordered Action Steps */}
              <ol className="space-y-2 rounded-2xl bg-canvas/75 p-4 text-[15px] leading-relaxed text-ink/95">
                {guide.quickSteps.map((step, index) => (
                  <li key={step} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold tabular-nums text-amber"
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {guide.safetyNote && (
                <p className="flex gap-2.5 border-l-2 border-sage/60 pl-3.5 text-xs leading-relaxed text-ink/90">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <span>{guide.safetyNote}</span>
                </p>
              )}

              {guide.action === 'la-pause' && onOpenSos && (
                <button
                  type="button"
                  onClick={() => onOpenSos('baby', true)}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-amber/40 bg-amber/15 px-3 text-xs font-semibold text-amber"
                >
                  <Moon aria-hidden="true" className="h-3.5 w-3.5" />
                  Open La Pause Timer →
                </button>
              )}

              {guide.action === 'breathe' && onOpenSos && (
                <button
                  type="button"
                  onClick={() => onOpenSos('parent')}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-sage/40 bg-sage/15 px-3 text-xs font-semibold text-sage"
                >
                  <HeartHandshake aria-hidden="true" className="h-3.5 w-3.5" />
                  Open Breathing &amp; Safe Pause →
                </button>
              )}

              {/* Non-exclusive native <details> disclosure for 9 PM couch reading + find-in-page */}
              <details className="group border-t border-line/70 pt-2">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-muted transition select-none active:text-ink [&::-webkit-details-marker]:hidden">
                  <ChevronRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-amber transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none"
                  />
                  <span>{guide.sayOutLoud ? 'Why + Exact Script' : 'Why this works'}</span>
                </summary>
                <div className="space-y-2.5 pb-1 pl-5 text-sm leading-relaxed">
                  {guide.sayOutLoud && (
                    <p className="rounded-xl border border-line bg-canvas p-3 italic text-ink">
                      <span className="not-italic font-semibold text-sage">Say out loud: </span>
                      {guide.sayOutLoud}
                    </p>
                  )}
                  <p className="text-muted">{guide.whyItWorks}</p>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}
