"use client";

import { getActiveModule } from "@/core/modules/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D5BottomCenterPanel() {
  const { activeModule } = useActiveModule();
  const module = getActiveModule(activeModule);

  const Panel = module.panels.bottomCenter;

  return <Panel />;
}