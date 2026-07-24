"use client";

import { useState, type ReactNode } from "react";

import { useAuth } from "./AuthProvider";
import LandingScreen from "./LandingScreen";
import LoginScreen from "./LoginScreen";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const [authMode, setAuthMode] = useState<"landing" | "login" | "create">(
    "landing",
  );

  if (!isHydrated) {
    return (
      <main
        aria-label="Loading Career Pivot"
        className="min-h-screen bg-[#092b39]"
      />
    );
  }

  if (isAuthenticated) {
    return children;
  }

  if (authMode === "landing") {
    return (
      <LandingScreen
        onCreateAccount={() => setAuthMode("create")}
        onLogin={() => setAuthMode("login")}
      />
    );
  }

  return (
    <>
      <LandingScreen
        onCreateAccount={() => setAuthMode("create")}
        onLogin={() => setAuthMode("login")}
      />
      <LoginScreen
        initialMode={authMode}
        onBack={() => setAuthMode("landing")}
      />
    </>
  );
}
