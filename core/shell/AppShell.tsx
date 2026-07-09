import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";

export default function AppShell() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f7f8fb] text-slate-900">
      <D1GlobalHeaderFrame />

      <div className="flex min-h-0 flex-1">
        <D2NavigationFrame />

        <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_24rem] gap-5 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(224,247,250,0.65),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f6f8fb_45%,#eef7fb_100%)] p-5">
          <D3WorkspaceFrame />
          <D4UtilityFrame />
        </main>
      </div>
    </div>
  );
}