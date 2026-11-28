import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  HeartHandshake,
  Moon,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { HOW_TO_CATEGORY_LABELS, HOW_TO_GUIDES } from '../../content/howToGuides';
import { PRACTICES } from '../../content/practices';
import { filterHowToGuides, isNightHours } from '../../domain/stageEngine';
import {
  HOW_TO_CATEGORIES,
  type BookFramework,
  type HowToCategoryId,
  type HowToGuide,
  type PracticeRep,
} from '../../domain/types';
import { useAppStore } from '../../state/useAppStore';
import { shareOrCopy } from '../shared/shareText';
import { TopUtilityRow } from '../shared/TopUtilityRow';
import {
  BookmarkIconButton,
  CardGuardrailBadge,
  FilterChip,
  PhilosophyTagButton,
  ShareIconButton,
} from '../shared/uiPrimitives';
import { useActiveStage } from '../shared/useActiveStage';
import { useNow } from '../shared/useNow';

interface HowToViewProps {
  initialCategory?: HowToCategoryId | null;
  onConsumeInitialCategory?: () => void;
  onOpenStagePicker?: () => void;
  onOpenSos?: (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => void;
  onOpenFramework?: (framework: BookFramework) => void;
}

type FilterId = HowToCategoryId | 'all' | 'saved';

function matchesGuideQuery(guide: HowToGuide, q: string): boolean {
  const haystack = [
    guide.title,
    guide.whenToUse,
    ...guide.quickSteps,
    guide.whyItWorks,
    guide.sayOutLoud ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function HowToView({
  initialCategory,
  onConsumeInitialCategory,
  onOpenStagePicker,
  onOpenSos,
  onOpenFramework,
}: HowToViewProps) {
  const now = useNow();
  const { activeStage } = useActiveStage();
  const savedCardIds = useAppStore((s) => s.savedCardIds);
  const toggleSavedCard = useAppStore((s) => s.toggleSavedCard);

  const [selectedFilter, setSelectedFilter] = useState<FilterId>(() =>
    initialCategory ?? (isNightHours(now) ? 'sleep' : 'all'),
  );
  const [query, setQuery] = useState('');
  const [showOtherAgesMatches, setShowOtherAgesMatches] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialCategory) {
      setSelectedFilter(initialCategory);
      setQuery('');
      onConsumeInitialCategory?.();
    }
  }, [initialCategory, onConsumeInitialCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stageGuides = useMemo(
    () => HOW_TO_GUIDES.filter((g) => g.stages.includes(activeStage.id)),
    [activeStage.id],
  );

  const savedHowToGuides = useMemo(
    () => HOW_TO_GUIDES.filter((g) => savedCardIds.includes(g.id)),
    [savedCardIds],
  );

  const savedPractices = useMemo(
    () => PRACTICES.filter((p) => savedCardIds.includes(p.id)),
    [savedCardIds],
  );

  const totalSavedCount = savedHowToGuides.length + savedPractices.length;

  const availableCategories = useMemo(
    () =>
      HOW_TO_CATEGORIES.filter((cat) =>
        stageGuides.some((guide) => guide.categories.includes(cat)),
      ),
    [stageGuides],
  );

  const filters = useMemo(() => {
    const items: { id: FilterId; label: string }[] = [{ id: 'all', label: 'All' }];
    if (totalSavedCount > 0) {
      items.push({ id: 'saved', label: `Saved (${totalSavedCount})` });
    }
    for (const cat of availableCategories) {
      items.push({ id: cat, label: HOW_TO_CATEGORY_LABELS[cat] });
    }
    return items;
  }, [availableCategories, totalSavedCount]);

  const effectiveFilter: FilterId =
    (selectedFilter === 'saved' && totalSavedCount === 0) ||
    (selectedFilter !== 'all' &&
      selectedFilter !== 'saved' &&
      !availableCategories.includes(selectedFilter))
      ? 'all'
      : selectedFilter;

  const normalizedQuery = query.trim().toLowerCase();

  const { visibleGuides, crossStageMatchesCount } = useMemo(() => {
    if (normalizedQuery) {
      const inStage = stageGuides.filter((g) => matchesGuideQuery(g, normalizedQuery));
      const allAges = HOW_TO_GUIDES.filter((g) => matchesGuideQuery(g, normalizedQuery));
      if (inStage.length === 0 && showOtherAgesMatches) {
        return { visibleGuides: allAges, crossStageMatchesCount: 0 };
      }
      return {
        visibleGuides: inStage,
        crossStageMatchesCount: inStage.length === 0 ? allAges.length : 0,
      };
    }

    if (effectiveFilter === 'saved') {
      return { visibleGuides: savedHowToGuides, crossStageMatchesCount: 0 };
    }

    return {
      visibleGuides: filterHowToGuides({
        stageId: activeStage.id,
        category: effectiveFilter,
        guides: HOW_TO_GUIDES,
      }),
      crossStageMatchesCount: 0,
    };
  }, [
    activeStage.id,
    effectiveFilter,
    normalizedQuery,
    savedHowToGuides,
    showOtherAgesMatches,
    stageGuides,
  ]);

  const handleShareGuide = (guide: HowToGuide) => {
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

  const handleSharePractice = (practice: PracticeRep) => {
    shareOrCopy(practice.title, practice.prompt).then((res) => {
      if (res === 'copied') {
        setCopiedId(practice.id);
        window.setTimeout(() => setCopiedId(null), 1800);
      }
    });
  };

  return (
    <div className="animate-calm-in space-y-4">
      <header className="space-y-3">
        <TopUtilityRow onOpenStagePicker={onOpenStagePicker} onOpenSos={onOpenSos} />
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted">
            10-Sec Steps · 9 PM Debrief
          </p>
          <h1 className="mt-1 font-serif text-[26px] leading-tight font-normal tracking-tight text-ink">
            How-To
          </h1>
        </div>
      </header>

      {/* Instant Search across all guides */}
      <search>
        <div className="relative flex items-center">
          <label htmlFor="howto-search" className="sr-only">
            Search How-To guides
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted"
          />
          <input
            id="howto-search"
            name="q"
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            placeholder="Search colic, biting, gagging, bedtime..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowOtherAgesMatches(false);
            }}
            className="h-11 w-full rounded-xl border border-line bg-surface pr-10 pl-10 text-base text-ink placeholder:text-muted/65 focus:border-amber focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
                setShowOtherAgesMatches(false);
              }}
              className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full text-muted transition active:text-ink"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
      </search>

      {/* Standardized 34px Capsule Filter Strip */}
      {!normalizedQuery && (
        <div
          role="group"
          aria-label="Filter guides by situation"
          className="no-scrollbar fade-right-mask -mx-5 flex snap-x snap-proximity gap-2 overflow-x-auto px-5 py-1.5 pr-10"
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              active={effectiveFilter === filter.id}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </FilterChip>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {/* Empty search fallback with 1-tap cross-stage reveal */}
        {normalizedQuery && visibleGuides.length === 0 && (
          <div className="space-y-3 rounded-2xl bg-surface p-5 text-sm text-muted ring-1 ring-line">
            <p>
              No How-To guides matching “<span className="text-ink">{query.trim()}</span>” in{' '}
              {activeStage.label}.
            </p>
            {crossStageMatchesCount > 0 && (
              <button
                type="button"
                onClick={() => setShowOtherAgesMatches(true)}
                className="h-11 rounded-xl border border-amber/40 bg-amber/15 px-4 text-xs font-semibold text-amber"
              >
                Show {crossStageMatchesCount} match{crossStageMatchesCount === 1 ? '' : 'es'} from
                other ages
              </button>
            )}
          </div>
        )}

        {/* Saved Daily Practices & Marriage Habits (Identical Card Grid & Footer!) */}
        {!normalizedQuery && effectiveFilter === 'saved' && savedPractices.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted">
              Saved Daily Practices ({savedPractices.length})
            </p>
            {savedPractices.map((practice) => {
              const isWhyOpen = Boolean(expandedIds[practice.id]);
              return (
                <article
                  key={practice.id}
                  className="space-y-3.5 rounded-2xl bg-surface p-5 ring-1 ring-line"
                >
                  <div className="flex min-h-[26px] items-center justify-between gap-2.5">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-sage">
                      <span className="ui-pill-label">
                        {practice.track === 'couple' ? 'Marriage & Self' : 'Daily Practice'}
                      </span>
                    </span>
                    <PhilosophyTagButton
                      framework={practice.framework}
                      onOpenFramework={onOpenFramework}
                    />
                  </div>

                  <h2 className="font-serif text-[20px] leading-snug font-normal text-ink">
                    {practice.title}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-ink/90">{practice.prompt}</p>

                  {isWhyOpen && (
                    <p
                      id={`saved-why-${practice.id}`}
                      className="border-l-2 border-line pl-3.5 text-sm leading-relaxed text-muted"
                    >
                      {practice.whyItWorks}
                    </p>
                  )}

                  <footer className="flex items-center justify-between gap-3 border-t border-line/65 pt-3">
                    <button
                      type="button"
                      aria-expanded={isWhyOpen}
                      aria-controls={`saved-why-${practice.id}`}
                      onClick={() => toggleExpanded(practice.id)}
                      className="relative inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted transition active:text-ink after:absolute after:-inset-y-1 after:inset-x-0"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 text-amber transition-transform duration-200 motion-reduce:transition-none ${
                          isWhyOpen ? 'rotate-90' : ''
                        }`}
                      />
                      <span>Why this works</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <BookmarkIconButton
                        saved={true}
                        label={`Remove bookmark for ${practice.title}`}
                        onToggle={() => toggleSavedCard(practice.id)}
                      />
                      <ShareIconButton
                        copied={copiedId === practice.id}
                        label={`Share ${practice.title}`}
                        onShare={() => handleSharePractice(practice)}
                      />
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}

        {!normalizedQuery &&
          effectiveFilter === 'saved' &&
          savedPractices.length > 0 &&
          visibleGuides.length > 0 && (
            <p className="pt-1 text-[11px] font-semibold tracking-widest uppercase text-muted">
              Saved How-To Guides ({visibleGuides.length})
            </p>
          )}

        {/* How-To Playbook Cards (Identical 20px Card Grid & True-Flex Footer) */}
        {visibleGuides.map((guide) => {
          const isSaved = savedCardIds.includes(guide.id);
          const isExpanded = Boolean(expandedIds[guide.id]);
          const regionId = `guide-why-${guide.id}`;

          return (
            <article
              key={guide.id}
              className="space-y-4 rounded-2xl bg-surface p-5 ring-1 ring-line"
            >
              {/* Uniform 26px Top Row: Guardrail Badge / Kicker on left, Philosophy Capsule flush on right */}
              <div className="flex min-h-[26px] items-center justify-between gap-2.5">
                {guide.badge ? (
                  <CardGuardrailBadge>{guide.badge}</CardGuardrailBadge>
                ) : (
                  <span className="min-w-0 truncate text-[11px] font-semibold tracking-wider uppercase text-muted">
                    <span className="ui-pill-label">
                      {HOW_TO_CATEGORY_LABELS[guide.categories[0]!]}
                    </span>
                  </span>
                )}
                <PhilosophyTagButton
                  framework={guide.framework}
                  onOpenFramework={onOpenFramework}
                />
              </div>

              <div>
                <h2 className="font-serif text-[20px] leading-snug font-normal text-ink">
                  {guide.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{guide.whenToUse}</p>
              </div>

              <ol className="space-y-2.5 border-l-2 border-amber/40 pl-4 text-[15px] leading-relaxed text-ink/95">
                {guide.quickSteps.map((step, index) => (
                  <li key={step} className="flex gap-2.5">
                    <span aria-hidden="true" className="font-semibold tabular-nums text-amber">
                      {index + 1}.
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
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber/40 bg-amber/15 px-3 text-xs font-semibold text-amber transition active:scale-[0.98]"
                >
                  <Moon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Open La Pause Timer →</span>
                </button>
              )}

              {guide.action === 'breathe' && onOpenSos && (
                <button
                  type="button"
                  onClick={() => onOpenSos('parent')}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-sage/40 bg-sage/15 px-3 text-xs font-semibold text-sage transition active:scale-[0.98]"
                >
                  <HeartHandshake aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Open Breathing &amp; Safe Pause →</span>
                </button>
              )}

              {isExpanded && (
                <div id={regionId} className="space-y-3 text-sm leading-relaxed">
                  {guide.sayOutLoud && (
                    <p className="border-l-2 border-amber/55 pl-3.5 font-serif text-[17px] italic leading-relaxed text-ink">
                      {guide.sayOutLoud}
                    </p>
                  )}
                  <p className="border-l-2 border-line pl-3.5 text-muted">{guide.whyItWorks}</p>
                </div>
              )}

              {/* True Flexbox Footer: Zero absolute positioning, 100% aligned with TodayView */}
              <footer className="flex items-center justify-between gap-3 border-t border-line/65 pt-3">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={regionId}
                  onClick={() => toggleExpanded(guide.id)}
                  className="relative inline-flex h-9 items-center gap-1.5 text-xs font-medium text-muted transition active:text-ink after:absolute after:-inset-y-1 after:inset-x-0"
                >
                  <ChevronRight
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 text-amber transition-transform duration-200 motion-reduce:transition-none ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span>{guide.sayOutLoud ? 'Why + Exact Script' : 'Why this works'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <BookmarkIconButton
                    saved={isSaved}
                    label={
                      isSaved ? `Remove bookmark for ${guide.title}` : `Bookmark ${guide.title}`
                    }
                    onToggle={() => toggleSavedCard(guide.id)}
                  />
                  <ShareIconButton
                    copied={copiedId === guide.id}
                    label={`Share ${guide.title}`}
                    onShare={() => handleShareGuide(guide)}
                  />
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
