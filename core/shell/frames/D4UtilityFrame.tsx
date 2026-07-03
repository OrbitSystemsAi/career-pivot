import D4UtilityTopPanel from "../panels/D4UtilityTopPanel";
import D4UtilityMiddlePanel from "../panels/D4UtilityMiddlePanel";
import D4UtilityBottomPanel from "../panels/D4UtilityBottomPanel";

type Props = {
  section: "top" | "bottom";
};

export default function D4UtilityFrame({ section }: Props) {
  if (section === "bottom") {
    return (
      <aside className="h-full min-h-0">
        <D4UtilityBottomPanel />
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 flex-col gap-4">
      <D4UtilityTopPanel />

      <div className="min-h-0 flex-1">
        <D4UtilityMiddlePanel />
      </div>
    </aside>
  );
}