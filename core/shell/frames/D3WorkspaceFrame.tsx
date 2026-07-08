import D3WorkspaceHeaderPanel from "../panels/D3WorkspaceHeaderPanel";
import D3WorkspaceControlsPanel from "../panels/D3WorkspaceControlsPanel";
import D3VisualizationPanel from "../panels/D3VisualizationPanel";

export default function D3WorkspaceFrame() {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <D3WorkspaceHeaderPanel />
      <D3WorkspaceControlsPanel />

      <div className="min-h-0 flex-1 bg-slate-50/80">
        <D3VisualizationPanel />
      </div>
    </section>
  );
}