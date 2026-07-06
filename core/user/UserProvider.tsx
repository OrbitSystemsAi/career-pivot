"use client";

import { createContext, useContext, useState } from "react";
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
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [activeResumeId, setActiveResumeId] = useState(
    mockUser.resumes.find((resume) => resume.status === "active")?.id ??
      mockUser.resumes[0]?.id
  );

  function addResume(resume: AddResumeInput) {
    const newResume: UserResume = {
      id: `resume-${Date.now()}`,
      name: resume.name,
      targetGoalId: user.goals[0]?.id ?? "",
      targetJobTitle: user.goals[0]?.title,
      status: "draft",
      fileName: resume.fileName,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      source: "upload",
      version: 1,
      createdDate: new Date().toISOString(),
    };

    setUser((currentUser) => ({
      ...currentUser,
      resumes: [...currentUser.resumes, newResume],
    }));

    setActiveResumeId(newResume.id);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        activeResumeId,
        setActiveResumeId,
        addResume,
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