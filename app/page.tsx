import AppShell from "@/core/shell/AppShell";
import { OSStateProvider } from "@/core/state/OSStateProvider";
import { UserProvider } from "@/core/user/UserProvider";

export default function Home() {
  return (
    <UserProvider>
      <OSStateProvider>
        <AppShell />
      </OSStateProvider>
    </UserProvider>
  );
}