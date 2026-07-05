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
    <aside className="flex min-h-0 flex-col gap-4">
      <UtilityTop />

      <div className="min-h-0 flex-1">
        <UtilityMiddle />
      </div>

      <div className="h-56 shrink-0">
        <UtilityBottom />
      </div>
    </aside>
  );
}