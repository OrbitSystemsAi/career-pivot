import { getActiveModule } from "@/core/modules/getActiveModule";

export default function D3VisualizationPanel() {
  const module = getActiveModule();

  const Visualization = module.panels.visualization;

  return (
    <div className="relative flex flex-1 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <Visualization />

      <div className="absolute bottom-4 left-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {module.name} Intelligence
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Powered by OSai modular intelligence engine.
        </div>
      </div>
    </div>
  );
}