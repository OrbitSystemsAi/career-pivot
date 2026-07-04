"use client";

import { getActiveModulePanels } from "@/core/modules/getActiveModulePanels";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

type Props = {
  section: "top" | "bottom";
};

export default function D4UtilityFrame({ section }: Props) {
  const { activeModule, activeView } = useActiveModule();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const UtilityTop = panels.utilityTop;
  const UtilityMiddle = panels.utilityMiddle;
  const UtilityBottom = panels.utilityBottom;

  if (section === "bottom") {
    return (
      <aside className="h-full min-h-0">
        <UtilityBottom />
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 flex-col gap-4">
      <UtilityTop />

      <div className="min-h-0 flex-1">
        <UtilityMiddle />
      </div>
    </aside>
  );
}