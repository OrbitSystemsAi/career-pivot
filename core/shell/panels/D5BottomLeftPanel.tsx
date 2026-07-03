"use client";

import { getActiveModule } from "@/core/modules/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D5BottomLeftPanel() {
  const { activeModule } = useActiveModule();
  const module = getActiveModule(activeModule);

  const Panel = module.panels.bottomLeft;

  return <Panel />;
}