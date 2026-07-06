"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { mockUser } from "./mockUser";
import type { UserProfile, UserResume } from "./userTypes";

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
  addResume: (resume: AddResumeInput) => void;
  updateResumeTargetGoal: (resumeId: string, goalId: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

const USER_STORAGE_KEY = "osai.userProfile";
const ACTIVE_RESUME_STORAGE_KEY = "osai.activeResumeId";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);

  const defaultResumeId =
    mockUser.resumes.find((resume) => resume.status === "active")?.id ??
    mockUser.resumes[0]?.id ??
    "";

  const [activeResumeId, setActiveResumeIdState] = useState(defaultResumeId);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    const storedResumeId = window.localStorage.getItem(
      ACTIVE_RESUME_STORAGE_KEY
    );

    let resolvedUser = mockUser;

    if (storedUser) {
      try {
        resolvedUser = JSON.parse(storedUser) as UserProfile;
        setUser(resolvedUser);
      } catch {
        resolvedUser = mockUser;
        setUser(mockUser);
      }
    }

    const fallbackResumeId =
      resolvedUser.resumes.find((resume) => resume.status === "active")?.id ??
      resolvedUser.resumes[0]?.id ??
      "";

    const storedResumeExists = resolvedUser.resumes.some(
      (resume) => resume.id === storedResumeId
    );

    if (storedResumeId && storedResumeExists) {
      setActiveResumeIdState(storedResumeId);
    } else {
      setActiveResumeIdState(fallbackResumeId);
      window.localStorage.setItem(ACTIVE_RESUME_STORAGE_KEY, fallbackResumeId);
    }

    setHasLoadedStorage(true);
  }, []);

  function persistUser(nextUser: UserProfile) {
    setUser(nextUser);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  }

  function setActiveResumeId(resumeId: string) {
    setActiveResumeIdState(resumeId);
    window.localStorage.setItem(ACTIVE_RESUME_STORAGE_KEY, resumeId);
  }

  function addResume(resume: AddResumeInput) {
    const defaultGoal = user.goals[0];

    const newResume: UserResume = {
      id: `resume-${Date.now()}`,
      name: resume.name,
      targetGoalId: defaultGoal?.id ?? "",
      targetJobTitle: defaultGoal?.title,
      status: "draft",
      fileName: resume.fileName,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      source: "upload",
      version: 1,
      createdDate: new Date().toISOString(),
    };

    const nextUser: UserProfile = {
      ...user,
      resumes: [...user.resumes, newResume],
    };

    persistUser(nextUser);
    setActiveResumeId(newResume.id);
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

  if (!hasLoadedStorage) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        activeResumeId,
        setActiveResumeId,
        addResume,
        updateResumeTargetGoal,
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