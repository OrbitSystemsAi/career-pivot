import type { ModuleDefinition } from "@/core/types/module";

import {
  ResumeModule,
  ResumeDocument,
  ResumeVersions,
  ResumeVersionCompare,
  ResumeATS,
  ResumeKeywords,
  ResumeFilters,
  ResumeContext,
  ResumeResults,
  ResumeStrengths,
  ResumeGaps,
  ResumeActions,
} from "@/modules/resume";

export const resumeModule: ModuleDefinition = {
  id: "resume",
  name: "Resume",
  description: "Resume Intelligence",
  icon: "📄",

  metrics: [
    { label: "Resume Score", value: "84%", change: "↑ +12%" },
    { label: "ATS Match", value: "76%", change: "↑ +9%" },
    { label: "Keywords", value: "48", change: "↑ +5" },
    { label: "Gaps", value: "7", change: "↓ -3" },
  ],

  views: [
    { label: "Document", id: "document" },
    { label: "Summary", id: "summary" },
    { label: "ATS", id: "ats" },
    { label: "Keywords", id: "keywords" },
    { label: "Versions", id: "versions" },
    { label: "Compare", id: "compare" },
  ],

  panels: {
    visualization: ResumeDocument,

    utilityTop: ResumeFilters,
    utilityMiddle: ResumeContext,
    utilityBottom: ResumeResults,

    bottomLeft: ResumeStrengths,
    bottomCenter: ResumeGaps,
    bottomRight: ResumeActions,
  },

  viewPanels: {
    document: {
      visualization: ResumeDocument,
    },

    summary: {
      visualization: ResumeModule,
    },

    ats: {
      visualization: ResumeATS,
    },

    keywords: {
      visualization: ResumeKeywords,
    },

    versions: {
      visualization: ResumeVersions,
    },

    compare: {
      visualization: ResumeVersionCompare,
    },
  },
};