import type { AgentRole } from "@/core/user/userTypes";

export type AgentDefinition = {
  role: AgentRole;
  name: string;
  description: string;
  handoff?: string;
};

export const agentCatalog: AgentDefinition[] = [
  {
    role: "opportunity",
    name: "Opportunity",
    description:
      "Searches for jobs and opportunities that match your target career, title, preferences, and evidence.",
    handoff: "Sends qualified opportunities to Resume Writer.",
  },
  {
    role: "resume_writer",
    name: "Resume Writer",
    description:
      "Creates tailored resumes and cover letters for opportunities you approve.",
    handoff: "Uses opportunities discovered by Opportunity.",
  },
  {
    role: "outreach",
    name: "Outreach",
    description:
      "Drafts personalized emails, messages, and follow-ups for approved contacts and opportunities.",
  },
  {
    role: "network_builder",
    name: "Network Builder",
    description:
      "Organizes relationships and identifies potential warm paths using connected network data.",
  },
];
