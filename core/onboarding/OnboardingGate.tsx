"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/core/auth/AuthProvider";
import OnboardingScreen from "./OnboardingScreen";

export default function OnboardingGate({ children }: { children: ReactNode }) {
  const { requiresOnboarding } = useAuth();

  return (
    <>
      {children}
      {requiresOnboarding ? <OnboardingScreen /> : null}
    </>
  );
}
