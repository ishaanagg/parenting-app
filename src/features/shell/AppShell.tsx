import { useState } from 'react';
import { BookOpen, LifeBuoy, Sun } from 'lucide-react';
import { MomentsView } from '../moments/MomentsView';
import { SosOverlay } from '../sos/SosOverlay';
import { TodayView } from '../today/TodayView';
import { StagePickerSheet } from './StagePickerSheet';

type TabId = 'today' | 'moments';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [sosState, setSosState] = useState<{
    open: boolean;
    initialPath?: 'baby' | 'parent';
  }>({ open: false });
  const [stagePickerOpen, setStagePickerOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#14110F] text-[#F4EFEA]">
      <main className="flex-1 px-5 pt-6 pb-28">
        {activeTab === 'today' ? (
          <TodayView
            onOpenStagePicker={() => setStagePickerOpen(true)}
            onOpenSos={(initialPath) =>
              setSosState({ open: true, initialPath })
            }
          />
        ) : (
          <MomentsView />
        )}
      </main>

      {/* Bottom Thumb-Zone Navigation */}
      <nav
        aria-label="Primary Navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#332A24] bg-[#14110F]/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition ${
              activeTab === 'today'
                ? 'bg-[#28211D] text-[#E09F67]'
                : 'text-[#B5A99F]'
            }`}
          >
            <Sun className="h-4 w-4" />
            Today
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('moments')}
            className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition ${
              activeTab === 'moments'
                ? 'bg-[#28211D] text-[#E09F67]'
                : 'text-[#B5A99F]'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Moments
          </button>

          <button
            type="button"
            onClick={() => setSosState({ open: true })}
            className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-[#E09F67]/40 bg-[#E09F67]/15 text-xs font-semibold text-[#E09F67] transition active:scale-[0.98]"
          >
            <LifeBuoy className="h-4 w-4" />
            SOS
          </button>
        </div>
      </nav>

      {stagePickerOpen && (
        <StagePickerSheet onClose={() => setStagePickerOpen(false)} />
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
