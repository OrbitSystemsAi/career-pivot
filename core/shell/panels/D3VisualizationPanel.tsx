"use client";

import { getActiveModulePanels } from "@/core/modules/getActiveModulePanels";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D3VisualizationPanel() {
  const { activeModule, activeView } = useActiveModule();
  const { module, panels } = getActiveModulePanels(activeModule, activeView);

  const Visualization = panels.visualization;

  const activeViewLabel =
    module.views.find((view) => view.id === activeView)?.label ?? "Overview";

  return (
    <div className="relative flex flex-1 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <Visualization />

      <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {module.description}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Active view: {activeViewLabel}
        </div>
      </div>
    </div>
  );
}