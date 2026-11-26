import { useState } from 'react';
import { OnboardingView } from './features/onboarding/OnboardingView';
import { useThemeSync } from './features/shared/useThemeSync';
import { AppShell } from './features/shell/AppShell';
import { SosOverlay } from './features/sos/SosOverlay';
import { useAppStore } from './state/useAppStore';

export function App() {
  useThemeSync();
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const [onboardingSosOpen, setOnboardingSosOpen] = useState(false);

  if (!hasCompletedOnboarding) {
    return (
      <>
        <OnboardingView onOpenSos={() => setOnboardingSosOpen(true)} />
        {onboardingSosOpen && (
          <SosOverlay onClose={() => setOnboardingSosOpen(false)} />
        )}
      </>
    );
  }

  return <AppShell />;
}

export default App;
