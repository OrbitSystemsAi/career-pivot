"use client";

import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D4UtilityFrame() {
  const { activeModule, activeView } = useOSState();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const UtilityTop = panels.utilityTop;
  const UtilityMiddle = panels.utilityMiddle;
  const UtilityBottom = panels.utilityBottom;

  return (
    <aside className="grid min-h-0 grid-rows-[18rem_minmax(0,1fr)_14rem] gap-4 overflow-hidden">
      <div className="min-h-0 overflow-hidden rounded-[1.5rem]">
        <UtilityTop />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.5rem]">
        <UtilityMiddle />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.5rem]">
        <UtilityBottom />
      </div>
    </aside>
  );
}