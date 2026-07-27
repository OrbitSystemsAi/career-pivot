"use client";

import { getActiveModule } from "@/core/moduleEngine/getActiveModule";
import { useOSState } from "@/core/state/OSStateProvider";
import D3WorkspaceHeaderPanel from "../panels/D3WorkspaceHeaderPanel";
import D3WorkspaceControlsPanel from "../panels/D3WorkspaceControlsPanel";
import D3VisualizationPanel from "../panels/D3VisualizationPanel";
import D5BottomWorkspaceFrame from "./D5BottomWorkspaceFrame";

export default function D3WorkspaceFrame() {
  const { activeModule, isD5Open, setIsD5Open } = useOSState();
  const moduleDefinition = getActiveModule(activeModule);
  const showWorkspaceHeader =
    moduleDefinition.shell?.showWorkspaceHeader ?? activeModule !== "home";
  const showWorkspaceControls =
    moduleDefinition.shell?.showWorkspaceControls ?? activeModule !== "home";
  const showBottomWorkspace =
    moduleDefinition.shell?.showBottomWorkspace ?? true;

  return (
    <div data-region="d3" className="flex min-h-0 flex-col px-[3px] pb-[3px] pt-0">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        {showWorkspaceHeader ? <D3WorkspaceHeaderPanel /> : null}
        {showWorkspaceControls ? <D3WorkspaceControlsPanel /> : null}
        <D3VisualizationPanel />
      </section>

      {showBottomWorkspace ? (
        <div className="mt-[3px] shrink-0">
          <D5BottomWorkspaceFrame
            isOpen={isD5Open}
            onToggle={() => setIsD5Open(!isD5Open)}
          />
        </div>
      ) : null}
    </div>
  );
}
