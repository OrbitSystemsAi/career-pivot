import { styles } from "@/core/design/styles";
import D3WorkspaceHeaderPanel from "../panels/D3WorkspaceHeaderPanel";
import D3WorkspaceControlsPanel from "../panels/D3WorkspaceControlsPanel";
import D3VisualizationPanel from "../panels/D3VisualizationPanel";

export default function D3WorkspaceFrame() {
  return (
    <section className={`flex min-h-0 flex-col overflow-hidden ${styles.surface.shellPanel}`}>
      <D3WorkspaceHeaderPanel />
      <D3WorkspaceControlsPanel />
      <D3VisualizationPanel />
    </section>
  );
}