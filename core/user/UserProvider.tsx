"use client";

import { createContext, useContext, useState } from "react";
import { mockUser } from "./mockUser";
import type { UserProfile } from "./userTypes";

type UserContextType = {
  user: UserProfile;
  activeResumeId: string;
  setActiveResumeId: (resumeId: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<UserProfile>(mockUser);
  const [activeResumeId, setActiveResumeId] = useState(
    mockUser.resumes.find((resume) => resume.status === "active")?.id ??
      mockUser.resumes[0]?.id
  );

  return (
    <UserContext.Provider
      value={{
        user,
        activeResumeId,
        setActiveResumeId,
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