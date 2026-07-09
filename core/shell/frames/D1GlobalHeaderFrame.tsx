"use client";

import { styles } from "@/core/design/styles";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D1GlobalHeaderFrame() {
  const { activeModule } = useOSState();
  const module = getActiveModule(activeModule);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div className="flex items-center gap-4">
        <div>
          <div className={styles.text.title}>OSai</div>

          <div className="text-xs text-slate-400">{module.description}</div>
        </div>
      </div>

      <div className="flex w-[460px] items-center rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-sm text-slate-500 shadow-inner">
        Search {module.name.toLowerCase()}...
      </div>

      <div className="flex items-center gap-3">
        <button className={styles.button.bordered}>AI Assistant</button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xs text-white">
          EP
        </div>
      </div>
    </header>
  );
}