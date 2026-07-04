"use client";

import { getActiveModulePanels } from "@/core/modules/getActiveModulePanels";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D5BottomLeftPanel() {
  const { activeModule, activeView } = useActiveModule();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const Panel = panels.bottomLeft;

  return <Panel />;
}