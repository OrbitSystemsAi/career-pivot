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
    <aside className="grid min-h-0 grid-rows-[18rem_minmax(0,1fr)_14rem] gap-5 overflow-hidden">
      <div className="min-h-0 overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
        <UtilityTop />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
        <UtilityMiddle />
      </div>

      <div className="min-h-0 overflow-hidden rounded-[1.75rem] shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
        <UtilityBottom />
      </div>
    </aside>
  );
}