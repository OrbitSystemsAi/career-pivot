"use client";

import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { useOSState } from "@/core/state/OSStateProvider";
import D5BottomWorkspaceFrame from "../frames/D5BottomWorkspaceFrame";

export default function D3VisualizationPanel() {
  const { activeModule, activeView } = useOSState();
  const { module, panels } = getActiveModulePanels(activeModule, activeView);

  const Visualization = panels.visualization;

  const activeViewLabel =
    module.views.find((view) => view.id === activeView)?.label ?? "Overview";

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-100 py-4">
      <div className="relative h-full min-h-0 overflow-hidden">
        <Visualization />

        <div className="absolute bottom-20 left-4 z-30 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {module.description}
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Active view: {activeViewLabel}
          </div>
        </div>

        <D5BottomWorkspaceFrame />
      </div>
    </div>
  );
}