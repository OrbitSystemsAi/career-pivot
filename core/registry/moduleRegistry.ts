import { agentsModule } from "@/modules/agents/module.config";
import { careerModule } from "@/modules/career/module.config";
import { networkModule } from "@/modules/network/module.config";
import { resumeModule } from "@/modules/resume/module.config";

export const moduleRegistry = {
  resume: resumeModule,
  career: careerModule,
  network: networkModule,
  agents: agentsModule,
};

export type ModuleKey = keyof typeof moduleRegistry;