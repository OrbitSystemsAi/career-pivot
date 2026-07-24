import type { ModuleDefinition } from "@/core/types/module";
import { JobsEmptyPanel, JobsWorkspace } from "@/modules/jobs";

export const jobsModule: ModuleDefinition = {
  id: "jobs",
  name: "Jobs",
  description: "Developer live job search",
  icon: "◇",
  metrics: [],
  views: [{ label: "Live Jobs", id: "live" }],
  shell: {
    showWorkspaceHeader: false,
    showWorkspaceControls: false,
    showUtility: false,
    showBottomWorkspace: false,
    visualizationPadding: false,
  },
  panels: {
    visualization: JobsWorkspace,
    utilityTop: JobsEmptyPanel,
    utilityMiddle: JobsEmptyPanel,
    utilityBottom: JobsEmptyPanel,
    bottomLeft: JobsEmptyPanel,
    bottomCenter: JobsEmptyPanel,
    bottomRight: JobsEmptyPanel,
  },
};
