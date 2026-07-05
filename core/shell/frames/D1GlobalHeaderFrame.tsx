"use client";

import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D1GlobalHeaderFrame() {
  const { activeModule } = useOSState();
  const module = getActiveModule(activeModule);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-blue-600">OS</span>
          <span className="text-slate-800">ai</span>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="text-sm font-semibold text-slate-700">
          {module.description}
        </div>
      </div>

      <div className="w-[420px] rounded-full border border-transparent bg-slate-50 px-4 py-2 text-sm text-slate-400 hover:border-slate-200 hover:bg-blue-50 hover:text-blue-600">
        Search {module.name.toLowerCase()}...
      </div>

      <button className="rounded-xl px-4 py-3 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600">
        AI Assistant
      </button>
    </header>
  );
}