"use client";

import { styles } from "@/core/design/styles";
import { moduleRegistry } from "@/core/registry/moduleRegistry";
import { useOSState } from "@/core/state/OSStateProvider";

export default function D2NavigationFrame() {
  const { activeModule, setActiveModule, setActiveView } = useOSState();

  return (
    <nav className="flex h-full w-24 flex-col items-center border-r border-[#416b75] bg-transparent shadow-[6px_0_24px_rgba(5,35,43,0.16)]">
      <div className="flex w-full flex-1 flex-col items-center">
        {Object.values(moduleRegistry).map((module) => {
          const selected = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id);
                setActiveView(module.views[0]?.id ?? "overview");
              }}
              className={`${styles.button.nav} ${
                selected ? styles.button.navSelected : styles.button.navDefault
              }`}
            >
              {module.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
