import D5BottomLeftPanel from "../panels/D5BottomLeftPanel";
import D5BottomCenterPanel from "../panels/D5BottomCenterPanel";
import D5BottomRightPanel from "../panels/D5BottomRightPanel";

export default function D5BottomWorkspaceFrame() {
  return (
    <section className="grid h-full min-h-0 grid-cols-3 gap-4">
      <D5BottomLeftPanel />
      <D5BottomCenterPanel />
      <D5BottomRightPanel />
    </section>
  );
}