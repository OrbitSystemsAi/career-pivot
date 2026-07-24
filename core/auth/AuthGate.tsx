"use client";

import type { ReactNode } from "react";

import { useAuth } from "./AuthProvider";
import LoginScreen from "./LoginScreen";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <main
        aria-label="Loading OSai"
        className="min-h-screen bg-[#092b39]"
      />
    );
  }

  return isAuthenticated ? children : <LoginScreen />;
}
