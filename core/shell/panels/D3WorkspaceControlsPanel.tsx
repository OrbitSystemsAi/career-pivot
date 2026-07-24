"use client";

import { styles } from "@/core/design/styles";
import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import { getResumeIntelligence } from "@/modules/resume/lib/resumeIntelligence";
import { getNetworkIntelligence } from "@/modules/network/lib/networkIntelligence";

export default function D3WorkspaceControlsPanel() {
  const { activeModule, activeView, setActiveView } = useOSState();
  const { user, activeResumeId } = useUser();
  const activeModuleDefinition = getActiveModule(activeModule);
  const { hasResume } = getResumeIntelligence(user, activeResumeId);
  const network = getNetworkIntelligence(user);

  if (
    (activeModule === "resume" && !hasResume) ||
    (activeModule === "network" && !network.hasConnectedSource)
  ) {
    return (
      <div className="flex h-16 items-center justify-center border-b border-[#416b75] bg-[#1b414c] px-4 text-sm text-[#c6d7da]">
        {activeModule === "network"
          ? "Connect LinkedIn or build your Career Pivot network to get started"
          : "Please upload to get started"}
      </div>
    );
  }

  return (
    <div className="flex h-16 items-center justify-center border-b border-[#416b75] bg-[#1b414c] px-4">
      <div className="flex items-center gap-2">
        {activeModuleDefinition.views.map((view) => {
          const selected = activeView === view.id;

          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`${styles.button.tab} ${
                selected
                  ? "border-b-2 border-orange-400 text-white"
                  : "text-[#c6d7da] hover:bg-[#275a65] hover:text-white"
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
