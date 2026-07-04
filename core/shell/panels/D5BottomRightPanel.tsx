"use client";

import { getActiveModulePanels } from "@/core/modules/getActiveModulePanels";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D5BottomRightPanel() {
  const { activeModule, activeView } = useActiveModule();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const Panel = panels.bottomRight;

  return <Panel />;
}