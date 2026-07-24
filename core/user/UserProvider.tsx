"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/core/auth/AuthProvider";
import type {
  ParsedResumeDocument,
  ResumeOptimizationSummary,
} from "@/core/resumeParsing/parsedResumeTypes";
import { getResumeProfilePrefill } from "@/core/resumeParsing/getResumeProfilePrefill";
import { buildStructuredResume } from "@/core/resumeParsing/buildStructuredResume";
import { serializeStructuredResume } from "@/core/resumeParsing/serializeStructuredResume";
import type { ResumeExperience } from "@/core/resumeParsing/resumeStructureTypes";
import { mockUser } from "./mockUser";
import { cleanProfileName } from "./cleanProfileName";
import type {
  CareerPreference,
  PlanningProgress,
  OpportunityProgress,
  AgentRole,
  ResumeVersion,
  UserGoal,
  UserProfile,
  UserResume,
} from "./userTypes";

type AddResumeInput = {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  parsedDocument?: ParsedResumeDocument;
};

type ResumeOptimizationType =
  | "ats"
  | "keywords"
  | "target_role"
  | "full_rewrite";

type UserContextType = {
  user: UserProfile;

  activeResumeId: string;
  setActiveResumeId: (resumeId: string) => void;

  compareVersionId: string;
  setCompareVersionId: (versionId: string) => void;

  addResume: (resume: AddResumeInput) => void;
  addGoal: (goal: UserGoal) => void;
  updateGoal: (goal: UserGoal) => void;
  deleteGoal: (goalId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  recruitAgent: (role: AgentRole, name: string) => void;
  updateAgentStatus: (
    agentId: string,
    status: "active" | "paused"
  ) => void;
  removeAgent: (agentId: string) => void;
  updatePlanningProgress: (progress: PlanningProgress) => void;
  updateOpportunityProgress: (progress: OpportunityProgress) => void;
  removeResume: (resumeId: string) => void;
  updateCareerPreference: (preference: CareerPreference) => void;
  updateResumeTargetGoal: (resumeId: string, goalId: string) => void;
  createResumeVersion: (resumeId: string, label: string) => void;
  updateResumeExperience: (
    resumeId: string,
    experience: ResumeExperience[],
  ) => void;
  restoreResumeVersion: (resumeId: string, versionId: string) => void;
  removeResumeVersion: (resumeId: string, versionId: string) => void;
  optimizeResume: (
    resumeId: string,
    optimizationType: ResumeOptimizationType
  ) => void;
};

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = "osai.userProfile";
const USER_STORAGE_VERSION_KEY = "osai.userProfileVersion";
const USER_STORAGE_VERSION = "evidence-planning-v1";
const ACTIVE_RESUME_STORAGE_KEY = "osai.activeResumeId";
const COMPARE_VERSION_STORAGE_KEY = "osai.compareVersionId";

function getScopedStorageKey(key: string, email: string) {
  return `${key}.${encodeURIComponent(email)}`;
}

function createEmptyUser(name: string, email: string): UserProfile {
  return {
    id: `user-${email}`,
    name,
    headline: "",
    highlights: [],
    location: "",
    currentTitle: "",
    currentIndustry: "",
    targetIndustries: [],
    skills: [],
    goals: [],
    resumes: [],
    careerPreference: {},
    planningProgress: {
      taskStatuses: {},
      submittedEvidence: [],
      agentArtifacts: [],
    },
    opportunityProgress: {
      savedOpportunityIds: [],
      dismissedOpportunityIds: [],
    },
    network: {
      connectedSources: [],
      connections: [],
    },
    agentWorkforce: {
      recruitedAgents: [],
      taskRuns: [],
    },
    reviewerProfile: {
      isReviewer: false,
      reviewIndustries: [],
      reviewSeniority: [],
      creditsEarned: 0,
      creditsAvailable: 0,
    },
  };
}

function normalizeResume(resume: UserResume): UserResume {
  const fallbackVersionId = `${resume.id}-v${resume.version ?? 1}`;

  const fallbackVersion: ResumeVersion = {
    id: fallbackVersionId,
    label: resume.source === "upload" ? "Original Upload" : "Current Version",
    source: resume.source === "upload" ? "upload" : "original",
    createdDate: resume.createdDate ?? new Date().toISOString(),
    isCurrent: true,
  };

  const versions =
    resume.versions && resume.versions.length > 0
      ? resume.versions
      : [fallbackVersion];

  const currentVersionId =
    resume.currentVersionId ??
    versions.find((version) => version.isCurrent)?.id ??
    versions[0]?.id ??
    fallbackVersionId;

  return {
    ...resume,
    parseStatus:
      resume.parseStatus ?? (resume.source === "mock" ? "mock" : "uploaded"),
    version: resume.version ?? versions.length,
    currentVersionId,
    versions: versions.map((version) => ({
      ...version,
      isCurrent: version.id === currentVersionId,
    })),
  };
}

function normalizeUser(user: UserProfile): UserProfile {
  const agentArtifacts = user.planningProgress?.agentArtifacts ?? [];
  const submittedEvidence = (
    user.planningProgress?.submittedEvidence ?? []
  ).map((item) => ({
    ...item,
    origin:
      item.origin ??
      (agentArtifacts.some(
        (artifact) =>
          artifact.taskId === item.taskId && artifact.status === "accepted"
      )
        ? ("agent_artifact" as const)
        : ("user" as const)),
  }));

  return {
    ...user,
    name: cleanProfileName(user.name),
    headline: user.headline ?? mockUser.headline,
    yearsExperience: user.yearsExperience ?? mockUser.yearsExperience,
    highlights: user.highlights ?? mockUser.highlights,
    careerPreference: {
      ...(user.careerPreference ?? {}),
      selectedCareerIds:
        user.careerPreference?.selectedCareerIds ??
        (user.careerPreference?.selectedCareerId
          ? [user.careerPreference.selectedCareerId]
          : []),
    },
    planningProgress: {
      taskStatuses: user.planningProgress?.taskStatuses ?? {},
      submittedEvidence,
      agentArtifacts,
    },
    opportunityProgress: {
      savedOpportunityIds:
        user.opportunityProgress?.savedOpportunityIds ?? [],
      dismissedOpportunityIds:
        user.opportunityProgress?.dismissedOpportunityIds ?? [],
    },
    network: {
      connectedSources: user.network?.connectedSources ?? [],
      connections: user.network?.connections ?? [],
    },
    agentWorkforce: {
      recruitedAgents: user.agentWorkforce?.recruitedAgents ?? [],
      taskRuns: user.agentWorkforce?.taskRuns ?? [],
    },
    goals: user.goals ?? [],
    resumes: user.resumes.map((resume) => normalizeResume(resume)),
  };
}

function getOptimizationLabel(
  optimizationType: ResumeOptimizationType,
  targetRole?: string
) {
  if (optimizationType === "ats") {
    return "ATS Optimized Version";
  }

  if (optimizationType === "keywords") {
    return "Keyword Optimized Version";
  }

  if (optimizationType === "target_role") {
    return `${targetRole ?? "Target Role"} Optimized Version`;
  }

  return "Full AI Rewrite Version";
}

function getOptimizationNotes(
  optimizationType: ResumeOptimizationType,
  targetRole?: string
) {
  if (optimizationType === "ats") {
    return [
      "Improved ATS alignment signals.",
      "Prioritized missing target keywords where supported by experience.",
      "Prepared this version for applicant tracking system review.",
    ];
  }

  if (optimizationType === "keywords") {
    return [
      "Expanded keyword coverage for the target role.",
      "Highlighted stronger matches between skills and job language.",
      "Prepared this version for keyword comparison.",
    ];
  }

  if (optimizationType === "target_role") {
    return [
      `Reframed resume language toward ${targetRole ?? "the target role"}.`,
      "Strengthened role-specific positioning.",
      "Improved alignment between experience and target career direction.",
    ];
  }

  return [
    "Created a full AI rewrite version.",
    "Preserved original upload as prior version.",
    "Prepared this version for review, compare, and export workflows.",
  ];
}

function buildOptimizedParsedDocument(
  currentParsedDocument: ParsedResumeDocument | undefined,
  optimizationType: ResumeOptimizationType,
  label: string,
  createdFromVersionId: string | undefined,
  createdDate: string,
  targetRole?: string
): ParsedResumeDocument | undefined {
  const optimizationSummary: ResumeOptimizationSummary = {
    type: optimizationType,
    label,
    notes: getOptimizationNotes(optimizationType, targetRole),
    createdFromVersionId,
    createdDate,
  };

  if (!currentParsedDocument) {
    return {
      fileName: label,
      rawText: optimizationSummary.notes.join("\n"),
      htmlPreview: `<h1>${label}</h1><p>${optimizationSummary.notes.join(
        "</p><p>"
      )}</p>`,
      lines: optimizationSummary.notes,
      optimizationSummary,
      parsedDate: createdDate,
    };
  }

  return {
    ...currentParsedDocument,
    fileName: currentParsedDocument.fileName,
    htmlPreview: currentParsedDocument.htmlPreview,
    optimizationSummary,
    parsedDate: createdDate,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { requiresOnboarding, session } = useAuth();
  const accountEmail = session?.email ?? "anonymous";
  const userStorageKey = getScopedStorageKey(USER_STORAGE_KEY, accountEmail);
  const userStorageVersionKey = getScopedStorageKey(
    USER_STORAGE_VERSION_KEY,
    accountEmail
  );
  const activeResumeStorageKey = getScopedStorageKey(
    ACTIVE_RESUME_STORAGE_KEY,
    accountEmail
  );
  const compareVersionStorageKey = getScopedStorageKey(
    COMPARE_VERSION_STORAGE_KEY,
    accountEmail
  );
  const [user, setUser] = useState<UserProfile>(() =>
    createEmptyUser(session?.displayName ?? "OSai User", accountEmail)
  );
  const userRef = useRef(user);

  const defaultResumeId =
    mockUser.resumes.find((resume) => resume.status === "active")?.id ??
    mockUser.resumes[0]?.id ??
    "";

  const defaultResume =
    mockUser.resumes.find((resume) => resume.id === defaultResumeId) ??
    mockUser.resumes[0];

  const defaultCompareVersionId =
    defaultResume?.versions.find((version) => !version.isCurrent)?.id ??
    defaultResume?.versions[0]?.id ??
    "";

  const [activeResumeId, setActiveResumeIdState] = useState(defaultResumeId);
  const [compareVersionId, setCompareVersionIdState] = useState(
    defaultCompareVersionId
  );
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(userStorageKey);
    const storedUserVersion = window.localStorage.getItem(
      userStorageVersionKey
    );
    const storedResumeId = window.localStorage.getItem(
      activeResumeStorageKey
    );
    const storedCompareVersionId = window.localStorage.getItem(
      compareVersionStorageKey
    );

    let resolvedUser = createEmptyUser(
      session?.displayName ?? "OSai User",
      accountEmail
    );

    if (storedUser && storedUserVersion === USER_STORAGE_VERSION) {
      try {
        resolvedUser = JSON.parse(storedUser) as UserProfile;
      } catch {
        resolvedUser = createEmptyUser(
          session?.displayName ?? "OSai User",
          accountEmail
        );
      }
    } else if (!requiresOnboarding) {
      const legacyUser = window.localStorage.getItem(USER_STORAGE_KEY);
      const legacyVersion = window.localStorage.getItem(
        USER_STORAGE_VERSION_KEY
      );

      if (legacyUser && legacyVersion === USER_STORAGE_VERSION) {
        try {
          resolvedUser = JSON.parse(legacyUser) as UserProfile;
        } catch {
          resolvedUser = mockUser;
        }
      }
    }

    const normalizedUser = normalizeUser(resolvedUser);

    // Intentional one-time hydration from the browser persistence boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(normalizedUser);
    window.localStorage.setItem(userStorageKey, JSON.stringify(normalizedUser));
    window.localStorage.setItem(userStorageVersionKey, USER_STORAGE_VERSION);

    const fallbackResumeId =
      normalizedUser.resumes.find((resume) => resume.status === "active")?.id ??
      normalizedUser.resumes[0]?.id ??
      "";

    const storedResumeExists = normalizedUser.resumes.some(
      (resume) => resume.id === storedResumeId
    );

    const resolvedResumeId =
      storedResumeId && storedResumeExists ? storedResumeId : fallbackResumeId;

    const resolvedResume =
      normalizedUser.resumes.find((resume) => resume.id === resolvedResumeId) ??
      normalizedUser.resumes[0];

    const fallbackCompareVersionId =
      resolvedResume?.versions.find(
        (version) => version.id !== resolvedResume.currentVersionId
      )?.id ??
      resolvedResume?.versions[0]?.id ??
      "";

    const storedCompareVersionExists = resolvedResume?.versions.some(
      (version) => version.id === storedCompareVersionId
    );

    setActiveResumeIdState(resolvedResumeId);
    window.localStorage.setItem(activeResumeStorageKey, resolvedResumeId);

    if (storedCompareVersionId && storedCompareVersionExists) {
      setCompareVersionIdState(storedCompareVersionId);
    } else {
      setCompareVersionIdState(fallbackCompareVersionId);
      window.localStorage.setItem(
        compareVersionStorageKey,
        fallbackCompareVersionId
      );
    }

    setHasLoadedStorage(true);
  }, [
    accountEmail,
    activeResumeStorageKey,
    compareVersionStorageKey,
    requiresOnboarding,
    session?.displayName,
    userStorageKey,
    userStorageVersionKey,
  ]);

  function persistUser(nextUser: UserProfile) {
    const normalizedUser = normalizeUser(nextUser);

    setUser(normalizedUser);
    window.localStorage.setItem(userStorageKey, JSON.stringify(normalizedUser));
  }

  function setActiveResumeId(resumeId: string) {
    const nextResume = user.resumes.find((resume) => resume.id === resumeId);

    const nextCompareVersionId =
      nextResume?.versions.find(
        (version) => version.id !== nextResume.currentVersionId
      )?.id ??
      nextResume?.versions[0]?.id ??
      "";

    setActiveResumeIdState(resumeId);
    setCompareVersionIdState(nextCompareVersionId);

    window.localStorage.setItem(activeResumeStorageKey, resumeId);
    window.localStorage.setItem(
      compareVersionStorageKey,
      nextCompareVersionId
    );
  }

  function setCompareVersionId(versionId: string) {
    setCompareVersionIdState(versionId);
    window.localStorage.setItem(compareVersionStorageKey, versionId);
  }

  function addResume(resume: AddResumeInput) {
    const defaultGoal = user.goals[0];
    const resumeId = `resume-${Date.now()}`;
    const createdDate = new Date().toISOString();
    const versionId = `${resumeId}-v1`;

    const newResume: UserResume = {
      id: resumeId,
      name: resume.name,
      targetGoalId: defaultGoal?.id ?? "",
      targetJobTitle: defaultGoal?.title,
      status: "draft",
      fileName: resume.fileName,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      source: "upload",
      version: 1,
      createdDate,
      parseStatus: resume.parsedDocument ? "parsed" : "uploaded",
      currentVersionId: versionId,
      versions: [
        {
          id: versionId,
          label: "Original Upload",
          source: "upload",
          createdDate,
          isCurrent: true,
          parsedDocument: resume.parsedDocument,
        },
      ],
    };

    const prefill = resume.parsedDocument
      ? getResumeProfilePrefill(resume.parsedDocument)
      : null;
    const nextUser: UserProfile = {
      ...user,
      name:
        user.name && user.name !== "OSai User"
          ? user.name
          : prefill?.name ?? user.name,
      location: user.location || prefill?.location || "",
      currentTitle: user.currentTitle || prefill?.currentTitle || "",
      currentIndustry: user.currentIndustry || prefill?.currentIndustry || "",
      headline: user.headline || prefill?.headline || "",
      yearsExperience: user.yearsExperience ?? prefill?.yearsExperience,
      skills:
        prefill?.skills && prefill.skills.length > 0
          ? Array.from(new Set([...user.skills, ...prefill.skills]))
          : user.skills,
      resumes: [...user.resumes, newResume],
    };

    persistUser(nextUser);
    setActiveResumeId(newResume.id);
  }

  function addGoal(goal: UserGoal) {
    persistUser({
      ...user,
      goals: [...user.goals, goal],
    });
  }

  function updateGoal(goal: UserGoal) {
    persistUser({
      ...user,
      goals: user.goals.map((item) => (item.id === goal.id ? goal : item)),
    });
  }

  function deleteGoal(goalId: string) {
    persistUser({
      ...user,
      goals: user.goals.filter((goal) => goal.id !== goalId),
      resumes: user.resumes.map((resume) =>
        resume.targetGoalId === goalId
          ? {
              ...resume,
              targetGoalId: "",
              targetJobTitle: undefined,
            }
          : resume
      ),
      planningProgress: {
        ...user.planningProgress,
        submittedEvidence: user.planningProgress.submittedEvidence.filter(
          (evidence) => evidence.goalId !== goalId
        ),
        agentArtifacts: user.planningProgress.agentArtifacts.filter(
          (artifact) => artifact.goalId !== goalId
        ),
      },
    });
  }

  const updateProfile = useCallback(
    (profile: Partial<UserProfile>) => {
      const currentUser = userRef.current;
      const normalizedUser = normalizeUser({
        ...currentUser,
        ...profile,
        id: currentUser.id,
        goals: currentUser.goals,
        resumes: currentUser.resumes,
        planningProgress: currentUser.planningProgress,
        opportunityProgress: currentUser.opportunityProgress,
        reviewerProfile: currentUser.reviewerProfile,
      });

      userRef.current = normalizedUser;
      setUser(normalizedUser);
      window.localStorage.setItem(
        userStorageKey,
        JSON.stringify(normalizedUser)
      );
    },
    [userStorageKey]
  );

  function recruitAgent(role: AgentRole, name: string) {
    if (
      user.agentWorkforce.recruitedAgents.some(
        (agent) => agent.role === role
      )
    ) {
      return;
    }

    persistUser({
      ...user,
      agentWorkforce: {
        ...user.agentWorkforce,
        recruitedAgents: [
          ...user.agentWorkforce.recruitedAgents,
          {
            id: `agent-${role}-${Date.now()}`,
            role,
            name,
            status: "active",
            recruitedAt: new Date().toISOString(),
          },
        ],
      },
    });
  }

  function updateAgentStatus(
    agentId: string,
    status: "active" | "paused"
  ) {
    persistUser({
      ...user,
      agentWorkforce: {
        ...user.agentWorkforce,
        recruitedAgents: user.agentWorkforce.recruitedAgents.map((agent) =>
          agent.id === agentId ? { ...agent, status } : agent
        ),
      },
    });
  }

  function removeAgent(agentId: string) {
    persistUser({
      ...user,
      agentWorkforce: {
        recruitedAgents: user.agentWorkforce.recruitedAgents.filter(
          (agent) => agent.id !== agentId
        ),
        taskRuns: user.agentWorkforce.taskRuns.filter(
          (run) => run.agentId !== agentId
        ),
      },
    });
  }

  function updatePlanningProgress(progress: PlanningProgress) {
    persistUser({
      ...user,
      planningProgress: progress,
    });
  }

  function updateOpportunityProgress(progress: OpportunityProgress) {
    persistUser({
      ...user,
      opportunityProgress: progress,
    });
  }

  function removeResume(resumeId: string) {
    const resumeToRemove = user.resumes.find((resume) => resume.id === resumeId);

    if (!resumeToRemove || resumeToRemove.source !== "upload") {
      return;
    }

    const nextResumes = user.resumes.filter((resume) => resume.id !== resumeId);

    const nextUser: UserProfile = {
      ...user,
      resumes: nextResumes,
    };

    const nextActiveResumeId =
      activeResumeId === resumeId
        ? nextResumes.find((resume) => resume.status === "active")?.id ??
          nextResumes[0]?.id ??
          ""
        : activeResumeId;

    persistUser(nextUser);
    setActiveResumeId(nextActiveResumeId);
  }

  function updateCareerPreference(preference: CareerPreference) {
    persistUser({
      ...user,
      careerPreference: {
        ...user.careerPreference,
        ...preference,
      },
    });
  }

  function updateResumeTargetGoal(resumeId: string, goalId: string) {
    const targetGoal = user.goals.find((goal) => goal.id === goalId);

    const nextUser: UserProfile = {
      ...user,
      resumes: user.resumes.map((resume) =>
        resume.id === resumeId
          ? {
              ...resume,
              targetGoalId: goalId,
              targetJobTitle: targetGoal?.title ?? resume.targetJobTitle,
            }
          : resume
      ),
    };

    persistUser(nextUser);
  }

  function createResumeVersion(resumeId: string, label: string) {
    const createdDate = new Date().toISOString();
    let createdVersionId = "";

    const nextUser: UserProfile = {
      ...user,
      resumes: user.resumes.map((resume) => {
        if (resume.id !== resumeId) {
          return resume;
        }

        const currentVersion = resume.versions.find(
          (version) => version.id === resume.currentVersionId
        );

        const nextVersionNumber = resume.versions.length + 1;
        const newVersionId = `${resume.id}-v${nextVersionNumber}-${Date.now()}`;
        createdVersionId = newVersionId;

        const newVersion: ResumeVersion = {
          id: newVersionId,
          label,
          source: "ai_optimized",
          createdDate,
          isCurrent: true,
          parsedDocument: currentVersion?.parsedDocument,
        };

        return {
          ...resume,
          version: nextVersionNumber,
          currentVersionId: newVersionId,
          versions: [
            ...resume.versions.map((version) => ({
              ...version,
              isCurrent: false,
            })),
            newVersion,
          ],
        };
      }),
    };

    persistUser(nextUser);

    if (createdVersionId) {
      setCompareVersionId(createdVersionId);
    }
  }

  const updateResumeExperience = useCallback(
    (resumeId: string, experience: ResumeExperience[]) => {
      const currentUser = userRef.current;
      const createdDate = new Date().toISOString();
      const currentResume = currentUser.resumes.find(
        (resume) => resume.id === resumeId,
      );
      const currentVersion = currentResume?.versions.find(
        (version) => version.id === currentResume.currentVersionId,
      );
      const currentDocument = currentVersion?.parsedDocument;
      const currentStructuredResume =
        currentDocument?.structuredResume ??
        (currentDocument?.lines.length
          ? buildStructuredResume(currentDocument.lines)
          : undefined);

      if (!currentResume || !currentDocument || !currentStructuredResume) {
        return;
      }

      const nextStructuredResume = {
        ...currentStructuredResume,
        experience,
      };
      const serializedResume = serializeStructuredResume(nextStructuredResume);
      const nextVersionNumber = currentResume.versions.length + 1;
      const nextVersionId = `${currentResume.id}-v${nextVersionNumber}-${Date.now()}`;
      const nextDocument: ParsedResumeDocument = {
        ...currentDocument,
        ...serializedResume,
        fileName: `${currentResume.name} — Career History Update`,
        parsedDate: createdDate,
        structuredResume: nextStructuredResume,
      };
      const existingIndustryHistory = currentUser.industryHistory ?? [];
      const nextIndustryHistory = experience.map((role) => {
        const existing = existingIndustryHistory.find(
          (job) =>
            job.id === role.id ||
            (job.company.trim().toLowerCase() === role.company.trim().toLowerCase() &&
              job.title.trim().toLowerCase() === role.title.trim().toLowerCase()),
        );

        return {
          id: role.id,
          industry: existing?.industry ?? currentUser.currentIndustry ?? "",
          title: role.title,
          company: role.company,
          startDate: role.startDate,
          endDate: role.endDate,
        };
      });
      const currentRole =
        experience.find((role) => /present|current/i.test(role.endDate ?? "")) ??
        experience[0];
      const nextUser = normalizeUser({
        ...currentUser,
        currentTitle: currentRole?.title ?? currentUser.currentTitle,
        industryHistory: nextIndustryHistory,
        industryHistoryResumeId: resumeId,
        resumes: currentUser.resumes.map((resume) =>
          resume.id === resumeId
            ? {
                ...resume,
                currentVersionId: nextVersionId,
                version: nextVersionNumber,
                versions: [
                  ...resume.versions.map((version) => ({
                    ...version,
                    isCurrent: false,
                  })),
                  {
                    id: nextVersionId,
                    label: "Career History Update",
                    source: "manual_edit" as const,
                    createdDate,
                    isCurrent: true,
                    parsedDocument: nextDocument,
                  },
                ],
              }
            : resume,
        ),
      });

      userRef.current = nextUser;
      setUser(nextUser);
      window.localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
      setCompareVersionIdState(currentVersion.id);
      window.localStorage.setItem(compareVersionStorageKey, currentVersion.id);
    },
    [compareVersionStorageKey, userStorageKey],
  );

  function restoreResumeVersion(resumeId: string, versionId: string) {
    const nextUser: UserProfile = {
      ...user,
      resumes: user.resumes.map((resume) => {
        if (resume.id !== resumeId) {
          return resume;
        }

        return {
          ...resume,
          currentVersionId: versionId,
          versions: resume.versions.map((version) => ({
            ...version,
            isCurrent: version.id === versionId,
          })),
        };
      }),
    };

    persistUser(nextUser);
  }

  function removeResumeVersion(resumeId: string, versionId: string) {
    const nextUser: UserProfile = {
      ...user,
      resumes: user.resumes.map((resume) => {
        if (resume.id !== resumeId || resume.versions.length <= 1) {
          return resume;
        }

        const nextVersions = resume.versions.filter(
          (version) => version.id !== versionId
        );

        const removedCurrentVersion = resume.currentVersionId === versionId;

        const nextCurrentVersionId = removedCurrentVersion
          ? nextVersions.at(-1)?.id ?? nextVersions[0]?.id ?? ""
          : resume.currentVersionId;

        return {
          ...resume,
          version: nextVersions.length,
          currentVersionId: nextCurrentVersionId,
          versions: nextVersions.map((version) => ({
            ...version,
            isCurrent: version.id === nextCurrentVersionId,
          })),
        };
      }),
    };

    persistUser(nextUser);

    if (compareVersionId === versionId) {
      const updatedResume = nextUser.resumes.find(
        (resume) => resume.id === resumeId
      );

      const nextCompareVersionId =
        updatedResume?.versions.find(
          (version) => version.id !== updatedResume.currentVersionId
        )?.id ??
        updatedResume?.versions[0]?.id ??
        "";

      setCompareVersionId(nextCompareVersionId);
    }
  }

  function optimizeResume(
    resumeId: string,
    optimizationType: ResumeOptimizationType
  ) {
    const resume = user.resumes.find((item) => item.id === resumeId);
    const targetGoal = user.goals.find(
      (goal) => goal.id === resume?.targetGoalId
    );
    const currentVersion = resume?.versions.find(
      (version) => version.id === resume.currentVersionId
    );

    const label = getOptimizationLabel(optimizationType, targetGoal?.title);
    const createdDate = new Date().toISOString();
    let createdVersionId = "";

    const nextUser: UserProfile = {
      ...user,
      resumes: user.resumes.map((item) => {
        if (item.id !== resumeId) {
          return item;
        }

        const nextVersionNumber = item.versions.length + 1;
        const newVersionId = `${item.id}-v${nextVersionNumber}-${Date.now()}`;
        createdVersionId = newVersionId;

        const newVersion: ResumeVersion = {
          id: newVersionId,
          label,
          source: "ai_optimized",
          createdDate,
          isCurrent: true,
          parsedDocument: buildOptimizedParsedDocument(
            currentVersion?.parsedDocument,
            optimizationType,
            label,
            currentVersion?.id,
            createdDate,
            targetGoal?.title
          ),
        };

        return {
          ...item,
          version: nextVersionNumber,
          currentVersionId: newVersionId,
          versions: [
            ...item.versions.map((version) => ({
              ...version,
              isCurrent: false,
            })),
            newVersion,
          ],
        };
      }),
    };

    persistUser(nextUser);

    if (createdVersionId) {
      setCompareVersionId(currentVersion?.id ?? createdVersionId);
    }
  }

  if (!hasLoadedStorage) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        activeResumeId,
        setActiveResumeId,
        compareVersionId,
        setCompareVersionId,
        addResume,
        addGoal,
        updateGoal,
        deleteGoal,
        updateProfile,
        recruitAgent,
        updateAgentStatus,
        removeAgent,
        updatePlanningProgress,
        updateOpportunityProgress,
        removeResume,
        updateCareerPreference,
        updateResumeTargetGoal,
        createResumeVersion,
        updateResumeExperience,
        restoreResumeVersion,
        removeResumeVersion,
        optimizeResume,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
