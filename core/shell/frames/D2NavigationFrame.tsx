"use client";

import { moduleRegistry } from "@/core/registry/moduleRegistry";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

const modules = Object.values(moduleRegistry);

export default function D2NavigationFrame() {
  const { activeModule, setActiveModule } = useActiveModule();

  return (
    <aside className="w-24 border-r border-slate-200 bg-slate-50 p-2">
      <div className="flex flex-col gap-2">
        {modules.map((module) => {
          const selected = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`rounded-xl px-2 py-3 text-xs font-medium transition ${
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <div className="mb-1">{module.icon}</div>
              <div>{module.name}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}