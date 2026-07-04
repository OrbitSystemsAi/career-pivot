import { getActiveModule } from "./getActiveModule";

export function getActiveModulePanels(activeModule: string, activeView: string) {
  const module = getActiveModule(activeModule);

  return {
    module,
    panels: {
      ...module.panels,
      ...(module.viewPanels?.[activeView] ?? {}),
    },
  };
}