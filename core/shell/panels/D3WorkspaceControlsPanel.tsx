"use client";

import { styles } from "@/core/design/styles";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D3WorkspaceControlsPanel() {
  const { activeModule, activeView, setActiveView } = useOSState();
  const module = getActiveModule(activeModule);

  return (
    <div className="flex h-16 items-center justify-center border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        {module.views.map((view) => {
          const selected = activeView === view.id;

          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`${styles.button.tab} ${
                selected ? styles.button.tabSelected : styles.button.tabDefault
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