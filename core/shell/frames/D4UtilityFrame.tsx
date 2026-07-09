"use client";

import { styles } from "@/core/design/styles";
import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D4UtilityFrame() {
  const { activeModule, activeView } = useOSState();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const UtilityTop = panels.utilityTop;
  const UtilityMiddle = panels.utilityMiddle;
  const UtilityBottom = panels.utilityBottom;

  return (
    <aside className={styles.layout.d4}>
      <div className="min-h-0 overflow-hidden rounded-[1.75rem]">
        <UtilityTop />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.75rem]">
        <UtilityMiddle />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.75rem]">
        <UtilityBottom />
      </div>
    </aside>
  );
}