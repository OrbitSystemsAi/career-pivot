"use client";

import { styles } from "@/core/design/styles";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";
import D1GlobalHeaderFrame from "./frames/D1GlobalHeaderFrame";
import D2NavigationFrame from "./frames/D2NavigationFrame";
import D3WorkspaceFrame from "./frames/D3WorkspaceFrame";
import D4UtilityFrame from "./frames/D4UtilityFrame";
import D6GlobalFooterFrame from "./frames/D6GlobalFooterFrame";

export default function AppShell() {
  const { activeModule } = useOSState();
  const moduleDefinition = getActiveModule(activeModule);
  const showUtility = moduleDefinition.shell?.showUtility ?? true;

  return (
    <div
      className={`${styles.layout.appShell} ${styles.surface.app}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(9,39,54,.84),rgba(9,43,57,.92)),url('/nav-texture.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <D1GlobalHeaderFrame />

      <div className="flex min-h-0 flex-1 pb-12">
        <D2NavigationFrame />

        <main
          className={`${
            showUtility
              ? styles.layout.main
              : "grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] overflow-hidden"
          } ${styles.surface.workspace}`}
        >
          <D3WorkspaceFrame />
          {showUtility ? <D4UtilityFrame /> : null}
        </main>
      </div>

      <D6GlobalFooterFrame />
    </div>
  );
}
