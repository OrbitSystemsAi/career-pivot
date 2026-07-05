import { ComponentType } from "react";

export type ModuleMetric = {
  label: string;
  value: string;
  change?: string;
};

export type ModuleView = {
  label: string;
  id: string;
};

export type ModulePanels = {
  visualization: ComponentType;

  utilityTop: ComponentType;
  utilityMiddle: ComponentType;
  utilityBottom: ComponentType;

  bottomLeft: ComponentType;
  bottomCenter: ComponentType;
  bottomRight: ComponentType;
};

export type ModuleDefinition = {
  id: string;
  name: string;
  description: string;
  icon?: string;

  metrics: ModuleMetric[];

  views: ModuleView[];

  panels: ModulePanels;

  viewPanels?: Record<string, Partial<ModulePanels>>;
};