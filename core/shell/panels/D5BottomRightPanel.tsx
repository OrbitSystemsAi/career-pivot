import { moduleRegistry } from "@/core/registry/moduleRegistry";

export default function D5BottomRightPanel() {
  const ActivePanel = moduleRegistry.career.panels.bottomRight;

  return <ActivePanel />;
}