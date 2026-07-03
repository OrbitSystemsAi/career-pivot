import { moduleRegistry } from "@/core/registry/moduleRegistry";

export default function D5BottomCenterPanel() {
  const ActivePanel = moduleRegistry.career.panels.bottomCenter;

  return <ActivePanel />;
}