import AppShell from "@/core/shell/AppShell";
import { ActiveModuleProvider } from "@/core/state/ActiveModuleProvider";

export default function Home() {
  return (
    <ActiveModuleProvider>
      <AppShell />
    </ActiveModuleProvider>
  );
}