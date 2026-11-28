import { useCallback, useEffect, useState } from 'react';
import { BookOpen, CalendarRange, Sun, Users } from 'lucide-react';
import type { BookFramework, HowToCategoryId } from '../../domain/types';
import { ByAgeView } from '../by-age/ByAgeView';
import { HowToView } from '../how-to/HowToView';
import { ParentsView } from '../parents/ParentsView';
import { FrameworkSheet } from '../shared/FrameworkSheet';
import { SosOverlay } from '../sos/SosOverlay';
import { TodayView } from '../today/TodayView';
import { SettingsSheet } from './SettingsSheet';

type TabId = 'today' | 'how-to' | 'by-age' | 'parents';
type OverlayKind = 'sos' | 'settings' | 'framework' | null;

interface AnchorHistoryState {
  anchorNav: true;
  tab: TabId;
  overlay: OverlayKind;
}

function isAnchorState(state: unknown): state is AnchorHistoryState {
  return (
    Boolean(state) &&
    typeof state === 'object' &&
    (state as Partial<AnchorHistoryState>).anchorNav === true
  );
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [sosState, setSosState] = useState<{
    open: boolean;
    initialPath?: 'baby' | 'parent';
    autoStartTimer?: boolean;
  }>({ open: false });
  const [stagePickerOpen, setStagePickerOpen] = useState(false);
  const [activeFramework, setActiveFramework] = useState<BookFramework | null>(null);
  const [howToJumpCategory, setHowToJumpCategory] = useState<HowToCategoryId | null>(null);

  const pushNavState = useCallback((tab: TabId, overlay: OverlayKind) => {
    try {
      const next: AnchorHistoryState = { anchorNav: true, tab, overlay };
      window.history.pushState(next, '');
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  // Seed initial history entry & listen for Android/browser Back (`popstate`)
  useEffect(() => {
    try {
      if (!isAnchorState(window.history.state)) {
        const base: AnchorHistoryState = { anchorNav: true, tab: 'today', overlay: null };
        window.history.replaceState(base, '');
      }
    } catch {
      // Ignore gracefully
    }

    const onPopState = (e: PopStateEvent) => {
      if (isAnchorState(e.state)) {
        setActiveTab(e.state.tab);
        setSosState((prev) => (e.state.overlay === 'sos' ? prev : { open: false }));
        setStagePickerOpen(e.state.overlay === 'settings');
        if (e.state.overlay !== 'framework') {
          setActiveFramework(null);
        }
      } else {
        setSosState({ open: false });
        setStagePickerOpen(false);
        setActiveFramework(null);
        setActiveTab('today');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectTab = (tab: TabId) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      pushNavState(tab, null);
    }
    try {
      window.scrollTo({ top: 0 });
    } catch {
      // jsdom does not implement scrollTo
    }
  };

  const handleOpenSos = (initialPath?: 'baby' | 'parent', autoStartTimer?: boolean) => {
    setSosState({ open: true, initialPath, autoStartTimer });
    pushNavState(activeTab, 'sos');
  };

  const handleOpenSettings = () => {
    setStagePickerOpen(true);
    pushNavState(activeTab, 'settings');
  };

  const handleOpenFramework = (framework: BookFramework) => {
    setActiveFramework(framework);
    pushNavState(activeTab, 'framework');
  };

  const closeOverlay = (kind: Exclude<OverlayKind, null>, clearLocal: () => void) => {
    clearLocal();
    try {
      if (isAnchorState(window.history.state) && window.history.state.overlay === kind) {
        window.history.back();
      }
    } catch {
      // Ignore gracefully
    }
  };

  return (
    <div className="bg-nursery-glow mx-auto flex min-h-dvh max-w-md flex-col bg-canvas text-ink">
      <main className="flex-1 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28">
        {activeTab === 'today' && (
          <TodayView
            onOpenStagePicker={handleOpenSettings}
            onOpenSos={handleOpenSos}
            onOpenFramework={handleOpenFramework}
          />
        )}
        {activeTab === 'how-to' && (
          <HowToView
            initialCategory={howToJumpCategory}
            onConsumeInitialCategory={() => setHowToJumpCategory(null)}
            onOpenStagePicker={handleOpenSettings}
            onOpenSos={handleOpenSos}
            onOpenFramework={handleOpenFramework}
          />
        )}
        {activeTab === 'by-age' && (
          <ByAgeView
            onOpenStagePicker={handleOpenSettings}
            onOpenSos={handleOpenSos}
            onOpenFramework={handleOpenFramework}
          />
        )}
        {activeTab === 'parents' && (
          <ParentsView
            onOpenStagePicker={handleOpenSettings}
            onOpenSos={handleOpenSos}
            onOpenFramework={handleOpenFramework}
          />
        )}
      </main>

      {/* Native-Standard Bottom Tab Bar (iOS HIG / Material 3 Indicator Pill) */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line/85 bg-surface/92 backdrop-blur-xl"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {(
            [
              { id: 'today', label: 'Today', Icon: Sun },
              { id: 'how-to', label: 'How-To', Icon: BookOpen },
              { id: 'by-age', label: 'By Age', Icon: CalendarRange },
              { id: 'parents', label: 'Parents', Icon: Users },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => handleSelectTab(id)}
                className={`flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-xl text-[11px] leading-none font-medium whitespace-nowrap transition active:scale-[0.97] ${
                  active ? 'text-amber' : 'text-muted active:text-ink'
                }`}
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? 'bg-amber/16 text-amber' : 'text-current'
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={active ? 2.2 : 1.85}
                    className="h-[19px] w-[19px]"
                  />
                </span>
                <span className="ui-pill-label">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {stagePickerOpen && (
        <SettingsSheet
          onClose={() => closeOverlay('settings', () => setStagePickerOpen(false))}
        />
      )}

      {activeFramework && (
        <FrameworkSheet
          framework={activeFramework}
          onClose={() => closeOverlay('framework', () => setActiveFramework(null))}
        />
      )}

      {sosState.open && (
        <SosOverlay
          initialPath={sosState.initialPath}
          autoStartTimer={sosState.autoStartTimer}
          onOpenHowTo={(category) => {
            setSosState({ open: false });
            setHowToJumpCategory(category);
            setActiveTab('how-to');
            pushNavState('how-to', null);
          }}
          onClose={() => closeOverlay('sos', () => setSosState({ open: false }))}
        />
      )}
    </div>
  );
}
