import { getActiveModule } from "@/core/modules/getActiveModule";

export default function D5BottomCenterPanel() {
  const module = getActiveModule();

  const Panel = module.panels.bottomCenter;

  return <Panel />;
}