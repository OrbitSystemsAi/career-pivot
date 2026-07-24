"use client";

import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D3VisualizationPanel() {
  const { activeModule, activeView } = useOSState();
  const { panels } = getActiveModulePanels(activeModule, activeView);
  const moduleDefinition = getActiveModule(activeModule);
  const hasPadding =
    moduleDefinition.shell?.visualizationPadding ?? activeModule !== "home";

  const Visualization = panels.visualization;

  return (
    <div
      className={`min-h-0 flex-1 overflow-hidden bg-white ${
        hasPadding ? "p-4" : "p-0"
      }`}
    >
      <div className="h-full overflow-hidden">
        <Visualization />
      </div>
    </div>
  );
}
