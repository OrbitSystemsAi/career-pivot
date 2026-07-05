import { moduleRegistry } from "@/core/registry/moduleRegistry";

export function getActiveModule(activeModule: string) {
  return moduleRegistry[
    activeModule as keyof typeof moduleRegistry
  ];
}