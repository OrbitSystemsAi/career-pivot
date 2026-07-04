"use client";

import { getActiveModule } from "@/core/modules/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D3VisualizationPanel() {
  const { activeModule, activeView } = useActiveModule();
  const module = getActiveModule(activeModule);

  const Visualization = module.panels.visualization;

  const activeViewLabel =
    module.views.find((view) => view.id === activeView)?.label ?? "Overview";

  const shouldShowPrimaryVisualization =
    activeView === module.views[0]?.id;

  return (
    <div className="relative flex flex-1 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      {shouldShowPrimaryVisualization ? (
        <Visualization />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {activeViewLabel}
            </div>

            <div className="mt-3 text-sm font-medium text-slate-700">
              {module.name} View
            </div>

            <div className="mt-2 text-xs text-slate-500">
              This view will be powered by the active module.
            </div>
          </div>
        </div>
      )}

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