import { styles } from "@/core/design/styles";
import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";

export default function AppShell() {
  return (
    <div className={`${styles.layout.appShell} ${styles.surface.app}`}>
      <D1GlobalHeaderFrame />

      <div className="flex min-h-0 flex-1">
        <D2NavigationFrame />

        <main className={`${styles.layout.main} ${styles.surface.workspace}`}>
          <D3WorkspaceFrame />
          <D4UtilityFrame />
        </main>
      </div>
    </div>
  );
}