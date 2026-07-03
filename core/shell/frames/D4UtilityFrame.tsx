"use client";

import { getActiveModule } from "@/core/modules/getActiveModule";
import { useActiveModule } from "@/core/state/ActiveModuleProvider";

type Props = {
  section: "top" | "bottom";
};

export default function D4UtilityFrame({ section }: Props) {
  const { activeModule } = useActiveModule();
  const module = getActiveModule(activeModule);

  const UtilityTop = module.panels.utilityTop;
  const UtilityMiddle = module.panels.utilityMiddle;
  const UtilityBottom = module.panels.utilityBottom;

  if (section === "bottom") {
    return (
      <aside className="h-full min-h-0">
        <UtilityBottom />
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 flex-col gap-4">
      <UtilityTop />

      <div className="min-h-0 flex-1">
        <UtilityMiddle />
      </div>
    </aside>
  );
}