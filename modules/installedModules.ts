import { agentsModule } from "@/modules/agents/module.config";
import { homeModule } from "@/modules/home/module.config";
import { careerModule } from "@/modules/career/module.config";
import { networkModule } from "@/modules/network/module.config";
import { resumeModule } from "@/modules/resume/module.config";
import { opportunityModule } from "@/modules/opportunity/module.config";
import { jobsModule } from "@/modules/jobs/module.config";

export const installedModules = {
  home: homeModule,
  career: careerModule,
  resume: resumeModule,
  opportunity: opportunityModule,
  jobs: jobsModule,
  network: networkModule,
  agents: agentsModule,
};
