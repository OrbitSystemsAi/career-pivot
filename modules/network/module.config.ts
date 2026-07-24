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

  metrics: [],

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
