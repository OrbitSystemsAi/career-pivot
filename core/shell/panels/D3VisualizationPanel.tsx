"use client";

import { getActiveModulePanels } from "@/core/moduleEngine/getActiveModulePanels";
import { useOSState } from "@/core/state/OSStateProvider";
import D5BottomWorkspaceFrame from "../frames/D5BottomWorkspaceFrame";

export default function D3VisualizationPanel() {
  const { activeModule, activeView, isD5Open, setIsD5Open } = useOSState();
  const { panels } = getActiveModulePanels(activeModule, activeView);

  const Visualization = panels.visualization;

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-100 py-4">
      <div
        className={`absolute left-0 right-0 top-4 overflow-hidden transition-all ${
          isD5Open ? "bottom-[19rem]" : "bottom-16"
        }`}
      >
        <Visualization />
      </div>

      <D5BottomWorkspaceFrame
        isOpen={isD5Open}
        onToggle={() => setIsD5Open(!isD5Open)}
      />
    </div>
  );
}