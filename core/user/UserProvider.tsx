"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { mockUser } from "./mockUser";
import type { ResumeVersion, UserProfile, UserResume } from "./userTypes";

type AddResumeInput = {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

type UserContextType = {
  user: UserProfile;

  activeResumeId: string;
  setActiveResumeId: (resumeId: string) => void;

  compareVersionId: string;
  setCompareVersionId: (versionId: string) => void;

  addResume: (resume: AddResumeInput) => void;
  removeResume: (resumeId: string) => void;
  updateResumeTargetGoal: (resumeId: string, goalId: string) => void;
  createResumeVersion: (resumeId: string, label: string) => void;
  restoreResumeVersion: (resumeId: string, versionId: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = "osai.userProfile";
const ACTIVE_RESUME_STORAGE_KEY = "osai.activeResumeId";
const COMPARE_VERSION_STORAGE_KEY = "osai.compareVersionId";

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
  return {
    ...user,
    resumes: user.resumes.map((resume) => normalizeResume(resume)),
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);

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
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    const storedResumeId = window.localStorage.getItem(
      ACTIVE_RESUME_STORAGE_KEY
    );
    const storedCompareVersionId = window.localStorage.getItem(
      COMPARE_VERSION_STORAGE_KEY
    );

    let resolvedUser = mockUser;

    if (storedUser) {
      try {
        resolvedUser = JSON.parse(storedUser) as UserProfile;
      } catch {
        resolvedUser = mockUser;
      }
    }

    const normalizedUser = normalizeUser(resolvedUser);

    setUser(normalizedUser);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));

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
    window.localStorage.setItem(ACTIVE_RESUME_STORAGE_KEY, resolvedResumeId);

    if (storedCompareVersionId && storedCompareVersionExists) {
      setCompareVersionIdState(storedCompareVersionId);
    } else {
      setCompareVersionIdState(fallbackCompareVersionId);
      window.localStorage.setItem(
        COMPARE_VERSION_STORAGE_KEY,
        fallbackCompareVersionId
      );
    }

    setHasLoadedStorage(true);
  }, []);

  function persistUser(nextUser: UserProfile) {
    const normalizedUser = normalizeUser(nextUser);

    setUser(normalizedUser);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
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

    window.localStorage.setItem(ACTIVE_RESUME_STORAGE_KEY, resumeId);
    window.localStorage.setItem(
      COMPARE_VERSION_STORAGE_KEY,
      nextCompareVersionId
    );
  }

  function setCompareVersionId(versionId: string) {
    setCompareVersionIdState(versionId);
    window.localStorage.setItem(COMPARE_VERSION_STORAGE_KEY, versionId);
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
      parseStatus: "uploaded",
      currentVersionId: versionId,
      versions: [
        {
          id: versionId,
          label: "Original Upload",
          source: "upload",
          createdDate,
          isCurrent: true,
        },
      ],
    };

    const nextUser: UserProfile = {
      ...user,
      resumes: [...user.resumes, newResume],
    };

    persistUser(nextUser);
    setActiveResumeId(newResume.id);
  }

  function removeResume(resumeId: string) {
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

        const nextVersionNumber = resume.versions.length + 1;
        const newVersionId = `${resume.id}-v${nextVersionNumber}-${Date.now()}`;
        createdVersionId = newVersionId;

        const newVersion: ResumeVersion = {
          id: newVersionId,
          label,
          source: "ai_optimized",
          createdDate,
          isCurrent: true,
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
        removeResume,
        updateResumeTargetGoal,
        createResumeVersion,
        restoreResumeVersion,
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