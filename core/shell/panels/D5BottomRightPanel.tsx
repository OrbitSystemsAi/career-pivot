import { getActiveModule } from "@/core/modules/getActiveModule";

export default function D5BottomRightPanel() {
  const module = getActiveModule();

  const Panel = module.panels.bottomRight;

  return <Panel />;
}