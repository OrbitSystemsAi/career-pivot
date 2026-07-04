"use client";

import { createContext, useContext, useState } from "react";

type ActiveModuleContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;

  activeView: string;
  setActiveView: (view: string) => void;
};

const ActiveModuleContext =
  createContext<ActiveModuleContextType | null>(null);

export function ActiveModuleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModule, setActiveModule] = useState("career");
  const [activeView, setActiveView] = useState("graph");

  return (
    <ActiveModuleContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </ActiveModuleContext.Provider>
  );
}

export function useActiveModule() {
  const context = useContext(ActiveModuleContext);

  if (!context) {
    throw new Error(
      "useActiveModule must be used inside ActiveModuleProvider"
    );
  }

  return context;
}