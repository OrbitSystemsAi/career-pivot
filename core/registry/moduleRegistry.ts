import { installedModules } from "@/modules/installedModules";

export const moduleRegistry = installedModules;

export type ModuleKey = keyof typeof moduleRegistry;