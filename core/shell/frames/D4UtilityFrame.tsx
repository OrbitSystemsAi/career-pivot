import D4UtilityTopPanel from "../panels/D4UtilityTopPanel";
import D4UtilityMiddlePanel from "../panels/D4UtilityMiddlePanel";
import D4UtilityBottomPanel from "../panels/D4UtilityBottomPanel";

export default function D4UtilityFrame() {
  return (
    <aside className="w-96 border-l border-slate-200 bg-slate-50 p-4 flex flex-col gap-4">
      <D4UtilityTopPanel />
      <D4UtilityMiddlePanel />
      <D4UtilityBottomPanel />
    </aside>
  );
}