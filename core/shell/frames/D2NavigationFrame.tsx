"use client";

import { moduleRegistry } from "@/core/registry/moduleRegistry";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D2NavigationFrame() {
  const { activeModule, setActiveModule } = useOSState();

  return (
    <nav className="flex h-full w-24 flex-col items-center gap-3 border-r border-slate-200 bg-slate-50 py-5">
      {Object.values(moduleRegistry).map((module) => {
        const selected = activeModule === module.id;

        return (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`flex h-16 w-20 flex-col items-center justify-center rounded-2xl text-xs font-medium transition ${
              selected
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {module.name}
          </button>
        );
      })}
    </nav>
  );
}