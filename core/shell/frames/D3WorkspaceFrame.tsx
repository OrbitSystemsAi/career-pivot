import D3WorkspaceHeaderPanel from "../panels/D3WorkspaceHeaderPanel";
import D3WorkspaceControlsPanel from "../panels/D3WorkspaceControlsPanel";
import D3VisualizationPanel from "../panels/D3VisualizationPanel";

export default function D3WorkspaceFrame() {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75 rem] border border-slate-200 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <D3WorkspaceHeaderPanel />
      <D3WorkspaceControlsPanel />
      <D3VisualizationPanel />
    </section>
  );
}