import type { ModuleDefinition } from "@/core/types/module";

import {
  NetworkModule,
  NetworkFilters,
  NetworkContext,
  NetworkResults,
  NetworkConnections,
  NetworkGaps,
  NetworkActions,
} from "@/modules/network";

export const networkModule: ModuleDefinition = {
  id: "network",
  name: "Network",
  description: "Network Intelligence",
  icon: "🌐",

  metrics: [
    { label: "Network Score", value: "68%", change: "↑ +21%" },
    { label: "Warm Paths", value: "14", change: "↑ +6" },
    { label: "Recruiters", value: "37", change: "↑ +8" },
    { label: "Target Companies", value: "22", change: "↑ +5" },
  ],

  views: [
    { label: "Map", id: "map" },
    { label: "Companies", id: "companies" },
    { label: "Recruiters", id: "recruiters" },
    { label: "Outreach", id: "outreach" },
  ],

  panels: {
    visualization: NetworkModule,

    utilityTop: NetworkFilters,
    utilityMiddle: NetworkContext,
    utilityBottom: NetworkResults,

    bottomLeft: NetworkConnections,
    bottomCenter: NetworkGaps,
    bottomRight: NetworkActions,
  },
};