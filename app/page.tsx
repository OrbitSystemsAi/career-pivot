import AuthGate from "@/core/auth/AuthGate";
import { AuthProvider } from "@/core/auth/AuthProvider";
import OnboardingGate from "@/core/onboarding/OnboardingGate";
import { ReviewProvider } from "@/core/reviews/ReviewProvider";
import AppShell from "@/core/shell/AppShell";
import { OSStateProvider } from "@/core/state/OSStateProvider";
import { UserProvider } from "@/core/user/UserProvider";

export default function Home() {
  return (
    <AuthProvider>
      <AuthGate>
        <UserProvider>
          <OnboardingGate>
            <ReviewProvider>
              <OSStateProvider>
                <AppShell />
              </OSStateProvider>
            </ReviewProvider>
          </OnboardingGate>
        </UserProvider>
      </AuthGate>
    </AuthProvider>
  );
}
