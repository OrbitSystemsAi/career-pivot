"use client";

import { useActiveModule } from "@/core/state/ActiveModuleProvider";

const views = [
  {
    label: "Resume",
    module: "resume",
  },
  {
    label: "Career",
    module: "career",
  },
  {
    label: "Network",
    module: "network",
  },
];

export default function D3WorkspaceControlsPanel() {
  const { activeModule, setActiveModule } = useActiveModule();

  return (
    <div className="relative flex h-14 items-center justify-center border-b border-slate-200">
      <div className="flex gap-3">
        {views.map((view) => {
          const selected = activeModule === view.module;

          return (
            <button
              key={view.module}
              onClick={() => setActiveModule(view.module)}
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