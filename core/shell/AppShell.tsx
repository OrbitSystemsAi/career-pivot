import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";
import D5BottomWorkspaceFrame from "./frames/D5BottomWorkspaceFrame";

export default function AppShell() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100">
      <D1GlobalHeaderFrame />

      <div className="flex min-h-0 flex-1">
        <D2NavigationFrame />

        <main className="grid min-h-0 flex-1 grid-cols-[1fr_24rem] grid-rows-[minmax(0,1fr)_14rem] gap-4 p-4">
          <D3WorkspaceFrame />
          <D4UtilityFrame section="top" />
          <D5BottomWorkspaceFrame />
          <D4UtilityFrame section="bottom" />
        </main>
      </div>
    </div>
  );
}