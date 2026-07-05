import AppShell from "@/core/shell/AppShell";
import { OSStateProvider } from "@/core/state/OSStateProvider";

export default function Home() {
  return (
    <OSStateProvider>
      <AppShell />
    </OSStateProvider>
  );
}