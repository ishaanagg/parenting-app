import { useState } from 'react';
import { BookOpen, LifeBuoy, Sun } from 'lucide-react';
import type { BookFramework } from '../../domain/types';
import { MomentsView } from '../moments/MomentsView';
import { FrameworkSheet } from '../shared/FrameworkSheet';
import { SosOverlay } from '../sos/SosOverlay';
import { TodayView } from '../today/TodayView';
import { SettingsSheet } from './SettingsSheet';

type TabId = 'today' | 'moments';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [sosState, setSosState] = useState<{
    open: boolean;
    initialPath?: 'baby' | 'parent';
  }>({ open: false });
  const [stagePickerOpen, setStagePickerOpen] = useState(false);
  const [activeFramework, setActiveFramework] = useState<BookFramework | null>(null);

  return (
    <div className="bg-nursery-glow mx-auto flex min-h-dvh max-w-md flex-col bg-canvas text-ink">
      <main className="flex-1 px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-28">
        {activeTab === 'today' ? (
          <TodayView
            onOpenStagePicker={() => setStagePickerOpen(true)}
            onOpenSos={(initialPath) => setSosState({ open: true, initialPath })}
            onOpenFramework={setActiveFramework}
          />
        ) : (
          <MomentsView
            onOpenStagePicker={() => setStagePickerOpen(true)}
            onOpenSos={(initialPath) => setSosState({ open: true, initialPath })}
            onOpenFramework={setActiveFramework}
          />
        )}
      </main>

      {/* Bottom Thumb-Zone Navigation */}
      <nav
        aria-label="Primary Navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition ${
              activeTab === 'today' ? 'bg-elevated text-amber' : 'text-muted'
            }`}
          >
            <Sun className="h-4 w-4" />
            Today
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('moments')}
            className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition ${
              activeTab === 'moments' ? 'bg-elevated text-amber' : 'text-muted'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Moments
          </button>

          <button
            type="button"
            onClick={() => setSosState({ open: true })}
            className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-amber/40 bg-amber/15 text-xs font-semibold text-amber transition active:scale-[0.98]"
          >
            <LifeBuoy className="h-4 w-4" />
            SOS
          </button>
        </div>
      </nav>

      {stagePickerOpen && (
        <SettingsSheet onClose={() => setStagePickerOpen(false)} />
      )}

      {activeFramework && (
        <FrameworkSheet
          framework={activeFramework}
          onClose={() => setActiveFramework(null)}
        />
      )}

      {sosState.open && (
        <SosOverlay
          initialPath={sosState.initialPath}
          onClose={() => setSosState({ open: false })}
        />
      )}
    </div>
  );
}
