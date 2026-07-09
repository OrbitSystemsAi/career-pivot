"use client";

import { moduleRegistry } from "@/core/registry/moduleRegistry";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D2NavigationFrame() {
  const { activeModule, setActiveModule } = useOSState();

  return (
    <nav className="flex h-full w-24 flex-col items-center border-r border-slate-200 bg-white py-5">
      <div className="mb-5 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-sm" />

      <div className="flex flex-1 flex-col items-center gap-2">
        {Object.values(moduleRegistry).map((module) => {
          const selected = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`flex h-14 w-20 items-center justify-center rounded-2xl text-xs font-semibold transition ${
                selected
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {module.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
        <button className="flex h-10 w-16 items-center justify-center rounded-xl text-xs font-semibold text-slate-400 hover:bg-blue-50 hover:text-blue-600">
          Help
        </button>

        <button className="flex h-10 w-16 items-center justify-center rounded-xl text-xs font-semibold text-slate-400 hover:bg-blue-50 hover:text-blue-600">
          More
        </button>
      </div>
    </nav>
  );
}