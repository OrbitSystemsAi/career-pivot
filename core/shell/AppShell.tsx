import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";
import D5BottomWorkspaceFrame from "./frames/D5BottomWorkspaceFrame";

export default function AppShell() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-950">
      <D1GlobalHeaderFrame />

      <div className="flex h-[calc(100vh-64px)]">
        <D2NavigationFrame />

        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <D3WorkspaceFrame />
          <D5BottomWorkspaceFrame />
        </main>

        <D4UtilityFrame />
      </div>
    </div>
  );
}