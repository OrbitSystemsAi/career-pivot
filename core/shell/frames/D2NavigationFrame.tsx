"use client";

import { styles } from "@/core/design/styles";
import { useOSState } from "@/core/state/OSStateProvider";

const navigationGroups = [
  [
    { label: "Home", moduleId: "home", viewId: "overview" },
    { label: "Resume", moduleId: "resume", viewId: "document" },
    { label: "Career", moduleId: "career", viewId: "goal" },
  ],
  [
    { label: "Paths", moduleId: "career", viewId: "market" },
    { label: "Opportunities", moduleId: "opportunity", viewId: "discover" },
    { label: "Jobs", moduleId: "jobs", viewId: "live" },
  ],
  [
    { label: "Network", moduleId: "network", viewId: "map" },
    { label: "Social", moduleId: "network", viewId: "outreach" },
    { label: "Agents", moduleId: "agents", viewId: "overview" },
  ],
] as const;

export default function D2NavigationFrame() {
  const {
    activeModule,
    activeView,
    setActiveModule,
    setActiveView,
  } = useOSState();

  return (
    <nav
      aria-label="Primary navigation"
      className="flex h-full w-48 shrink-0 flex-col border-r border-[#416b75] bg-transparent shadow-[6px_0_24px_rgba(5,35,43,0.16)]"
    >
      <div className="flex w-full flex-1 flex-col">
        {navigationGroups.map((group, groupIndex) => (
          <div
            className={groupIndex === 0 ? "" : "border-t border-[#416b75]/70 pt-2"}
            key={group[0].label}
          >
            {group.map((item) => {
              const selected = (() => {
                if (activeModule !== item.moduleId) {
                  return false;
                }

                if (item.label === "Career") {
                  return activeView !== "market";
                }

                if (item.label === "Paths") {
                  return activeView === "market";
                }

                if (item.label === "Network") {
                  return activeView !== "outreach";
                }

                if (item.label === "Social") {
                  return activeView === "outreach";
                }

                return true;
              })();

              return (
                <button
                  aria-current={selected ? "page" : undefined}
                  className={`${styles.button.nav} ${
                    selected
                      ? styles.button.navSelected
                      : styles.button.navDefault
                  }`}
                  key={item.label}
                  onClick={() => {
                    setActiveModule(item.moduleId);
                    setActiveView(item.viewId);
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
