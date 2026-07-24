import type { UserProfile } from "@/core/user/userTypes";

export function getNetworkIntelligence(user: UserProfile) {
  const connectedSources = user.network?.connectedSources ?? [];
  const connections = user.network?.connections ?? [];
  const warmPaths = connections.filter(
    (connection) => connection.relationship === "warm"
  ).length;
  const recruiters = connections.filter((connection) =>
    /recruit|talent acquisition/i.test(connection.headline ?? "")
  ).length;
  const targetCompanies = new Set(
    connections
      .map((connection) => connection.company?.trim())
      .filter((company): company is string => Boolean(company))
  ).size;
  const score =
    connections.length > 0
      ? Math.min(100, Math.round(35 + warmPaths * 8 + targetCompanies * 4))
      : 0;

  return {
    connectedSources,
    connections,
    hasConnectedSource: connectedSources.length > 0,
    hasConnections: connections.length > 0,
    warmPaths,
    recruiters,
    targetCompanies,
    score,
  };
}
