import { ComponentType } from "react";

export type ModuleMetric = {
  label: string;
  value: string;
  change?: string;
};

export type ModuleDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;

  metrics: ModuleMetric[];

  panels: {
    visualization: ComponentType;

    utilityTop: ComponentType;
    utilityMiddle: ComponentType;
    utilityBottom: ComponentType;

    bottomLeft: ComponentType;
    bottomCenter: ComponentType;
    bottomRight: ComponentType;
  };
};