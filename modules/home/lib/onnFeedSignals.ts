import type { UserProfile } from "@/core/user/userTypes";

export type OnnFeedSignal = {
  slug: string;
  weight: number;
  source: "career" | "interest" | "group" | "network";
};

export function deriveOnnFeedSignals(user: UserProfile) {
  const topics = new Map<string, OnnFeedSignal>();
  const add = (slug: string, weight: number, source: OnnFeedSignal["source"] = "career") => topics.set(slug, { slug, weight, source });
  add("careers", 10);
  add("employment", 8);

  const directions = user.onboarding?.goalDirections ?? [];
  const goalTypes = new Set(user.goals.flatMap((goal) => goal.goalTypes));
  if (directions.some((direction) => ["work_remote", "work_from_home", "work_abroad"].includes(direction)) || user.onboarding?.workPreference === "remote") add("remote-work", 9);
  if (directions.some((direction) => ["start_business", "grow_business", "build_multiple_businesses", "independent_work"].includes(direction)) || goalTypes.has("business")) add("business", 8);
  if (goalTypes.has("education")) add("education", 7, "interest");
  if (user.skills.some((skill) => /\b(?:ai|artificial intelligence|machine learning)\b/i.test(skill))) add("artificial-intelligence", 6, "interest");

  const industries = [user.currentIndustry, ...user.targetIndustries].join(" ");
  if (/\b(?:technology|software|digital|data)\b/i.test(industries)) {
    add("technology", 7, "interest");
    add("digital-transformation", 6, "interest");
  }
  if (/\b(?:health|healthcare|medical|medicine)\b/i.test(industries)) add("healthcare", 7, "interest");
  if (/\b(?:finance|financial|banking)\b/i.test(industries)) add("finance", 7, "interest");
  if (/\b(?:marketing|advertising)\b/i.test(industries)) add("marketing", 7, "interest");

  return {
    classifications: [{ slug: "work-and-careers", weight: 10, source: "career" as const }],
    topics: [...topics.values()].slice(0, 10),
  };
}
