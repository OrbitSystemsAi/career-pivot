import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";
import D5BottomWorkspaceFrame from "./frames/D5BottomWorkspaceFrame";

export default function AppShell() {
  return (
    <div className="h-screen w-screen bg-slate-100">
      <D1GlobalHeaderFrame />

      <div className="flex h-[calc(100vh-64px)]">
        <D2NavigationFrame />

        <main className="flex flex-1 flex-col">
          <D3WorkspaceFrame />
          <D5BottomWorkspaceFrame />
        </main>

        <D4UtilityFrame />
      </div>
    </div>
  );
}