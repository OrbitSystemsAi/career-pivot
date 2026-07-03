import { activeModule } from "@/core/state/activeModule";
import { moduleRegistry } from "@/core/registry/moduleRegistry";

export function getActiveModule() {
  return moduleRegistry[activeModule.id as keyof typeof moduleRegistry];
}