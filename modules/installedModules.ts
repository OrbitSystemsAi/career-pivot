import { agentsModule } from "@/modules/agents/module.config";
import { careerModule } from "@/modules/career/module.config";
import { networkModule } from "@/modules/network/module.config";
import { resumeModule } from "@/modules/resume/module.config";

export const installedModules = {
  resume: resumeModule,
  career: careerModule,
  network: networkModule,
  agents: agentsModule,
};