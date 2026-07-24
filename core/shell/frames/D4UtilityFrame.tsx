"use client";

import { styles } from "@/core/design/styles";
import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { useOSState } from "@/core/state/OSStateProvider";
import { PanelCardRailProvider } from "@/core/ui/PanelCard";

export default function D4UtilityFrame() {
  const { activeModule, activeView } = useOSState();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const UtilityTop = panels.utilityTop;
  const UtilityMiddle = panels.utilityMiddle;
  const UtilityBottom = panels.utilityBottom;

  return (
    <aside className={styles.layout.d4} data-region="d4">
      <div className="h-full min-h-0 overflow-auto bg-transparent text-[#d3e1e4] shadow-sm">
        <PanelCardRailProvider>
          <UtilityTop />

          <UtilityMiddle />

          <UtilityBottom />
        </PanelCardRailProvider>
      </div>
    </aside>
  );
}
