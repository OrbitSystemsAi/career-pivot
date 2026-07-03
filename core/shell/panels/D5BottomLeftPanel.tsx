import { moduleRegistry } from "@/core/registry/moduleRegistry";

export default function D5BottomLeftPanel() {
  const ActivePanel = moduleRegistry.career.panels.bottomLeft;

  return <ActivePanel />;
}