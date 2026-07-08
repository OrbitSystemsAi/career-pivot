"use client";

import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D1GlobalHeaderFrame() {
  const { activeModule } = useOSState();
  const module = getActiveModule(activeModule);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
          OS
        </div>

        <div>
          <div className="text-sm font-bold tracking-tight text-slate-900">
            OSai
          </div>

          <div className="text-xs font-medium text-slate-400">
            {module.description}
          </div>
        </div>
      </div>

      <div className="flex w-[460px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400 shadow-inner">
        Search {module.name.toLowerCase()}...
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-blue-50 hover:text-blue-600">
          AI Assistant
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          EP
        </div>
      </div>
    </header>
  );
}