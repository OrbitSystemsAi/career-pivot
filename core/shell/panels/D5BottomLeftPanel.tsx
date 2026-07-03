import { getActiveModule } from "@/core/modules/getActiveModule";

export default function D5BottomLeftPanel() {
  const module = getActiveModule();

  const Panel = module.panels.bottomLeft;

  return <Panel />;
}