"use client";

import { moduleRegistry } from "@/core/registry/moduleRegistry";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D2NavigationFrame() {
  const { activeModule, setActiveModule } = useOSState();

  return (
    <nav className="flex h-full w-20 flex-col items-center border-r border-slate-200 bg-white py-4">
      <div className="mb-5 h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-sm" />

      <div className="flex flex-1 flex-col items-center gap-2">
        {Object.values(moduleRegistry).map((module) => {
          const selected = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl text-[0.68rem] font-semibold transition ${
                selected
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-400 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <span className="text-base">{module.icon}</span>
              <span className="mt-1 max-w-[3.4rem] truncate">
                {module.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600">
          ?
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600">
          •••
        </button>
      </div>
    </nav>
  );
}