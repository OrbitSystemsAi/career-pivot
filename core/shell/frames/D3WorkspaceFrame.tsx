import D3WorkspaceHeaderPanel from "../panels/D3WorkspaceHeaderPanel";
import D3WorkspaceControlsPanel from "../panels/D3WorkspaceControlsPanel";
import D3VisualizationPanel from "../panels/D3VisualizationPanel";

export default function D3WorkspaceFrame() {
  return (
    <section className="m-4 mb-2 flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white">
      <D3WorkspaceHeaderPanel />
      <D3WorkspaceControlsPanel />
      <D3VisualizationPanel />
    </section>
  );
}