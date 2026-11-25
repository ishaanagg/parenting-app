import { OnboardingView } from './features/onboarding/OnboardingView';
import { AppShell } from './features/shell/AppShell';
import { useAppStore } from './state/useAppStore';

export function App() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  if (!hasCompletedOnboarding) {
    return <OnboardingView />;
  }

  return <AppShell />;
}

export default App;
