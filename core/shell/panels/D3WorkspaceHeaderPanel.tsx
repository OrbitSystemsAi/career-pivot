"use client";

import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

export default function D3WorkspaceHeaderPanel() {
  const { activeModule } = useActiveModule();
  const module = getActiveModule(activeModule);
  const metrics = module.metrics;

  return (
    <div className="grid h-20 grid-cols-[56px_1fr_1fr_1fr_1fr_56px] border-b border-slate-200">
      <button className="flex items-center justify-center border-r border-slate-100 text-xl font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600">
        ‹
      </button>

      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center justify-center border-r border-slate-100 hover:bg-blue-50"
        >
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-lg font-bold text-slate-900">
                {metric.value}
              </div>

              {metric.change && (
                <div className="text-[11px] font-medium text-emerald-600">
                  {metric.change}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500">{metric.label}</div>
          </div>
        </div>
      ))}

      <button className="flex items-center justify-center text-xl font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600">
        ›
      </button>
    </div>
  );
}