import { useCallback, useEffect, useState } from 'react';
import { BookOpen, CalendarRange, Sun } from 'lucide-react';
import type { BookFramework } from '../../domain/types';
import { ByAgeView } from '../by-age/ByAgeView';
import { HowToView } from '../how-to/HowToView';
import { FrameworkSheet } from '../shared/FrameworkSheet';
import { SosOverlay } from '../sos/SosOverlay';
import { TodayView } from '../today/TodayView';
import { SettingsSheet } from './SettingsSheet';

type TabId = 'today' | 'how-to' | 'by-age';
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
      </main>

      {/* Bottom Thumb-Zone Navigation (Peacetime-First) */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-2 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            aria-current={activeTab === 'today' ? 'page' : undefined}
            onClick={() => handleSelectTab('today')}
            className={`flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs transition ${
              activeTab === 'today'
                ? 'bg-elevated font-semibold text-amber ring-1 ring-amber/30'
                : 'font-medium text-muted'
            }`}
          >
            <Sun aria-hidden="true" className="h-4 w-4" />
            Today
          </button>

          <button
            type="button"
            aria-current={activeTab === 'how-to' ? 'page' : undefined}
            onClick={() => handleSelectTab('how-to')}
            className={`flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs transition ${
              activeTab === 'how-to'
                ? 'bg-elevated font-semibold text-amber ring-1 ring-amber/30'
                : 'font-medium text-muted'
            }`}
          >
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            How-To
          </button>

          <button
            type="button"
            aria-current={activeTab === 'by-age' ? 'page' : undefined}
            onClick={() => handleSelectTab('by-age')}
            className={`flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs transition ${
              activeTab === 'by-age'
                ? 'bg-elevated font-semibold text-amber ring-1 ring-amber/30'
                : 'font-medium text-muted'
            }`}
          >
            <CalendarRange aria-hidden="true" className="h-4 w-4" />
            By Age
          </button>
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
          onClose={() => closeOverlay('sos', () => setSosState({ open: false }))}
        />
      )}
    </div>
  );
}
