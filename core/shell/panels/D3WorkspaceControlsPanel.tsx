"use client";

import { getActiveModule } from "@/core/modules/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";
import { useState } from "react";

export default function D3WorkspaceControlsPanel() {
  const { activeModule } = useActiveModule();
  const module = getActiveModule(activeModule);

  const [activeView, setActiveView] = useState(module.views[0]?.id);

  return (
    <div className="relative flex h-14 items-center justify-center border-b border-slate-200">
      <div className="flex gap-3">
        {module.views.map((view) => {
          const selected = activeView === view.id;

          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`rounded-xl px-2 py-3 text-xs font-medium transition ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {view.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}