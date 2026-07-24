import { getActiveModule } from "./getActiveModule";

export function getActiveModulePanels(activeModule: string, activeView: string) {
  const activeModuleDefinition = getActiveModule(activeModule);

  return {
    module: activeModuleDefinition,
    panels: {
      ...activeModuleDefinition.panels,
      ...(activeModuleDefinition.viewPanels?.[activeView] ?? {}),
    },
  };
}
