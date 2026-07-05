"use client";

import { createContext, useContext, useState } from "react";

type OSStateContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;

  activeView: string;
  setActiveView: (view: string) => void;
};

const OSStateContext = createContext<OSStateContextType | null>(null);

export function OSStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModule, setActiveModule] = useState("career");
  const [activeView, setActiveView] = useState("graph");

  return (
    <OSStateContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </OSStateContext.Provider>
  );
}

export function useOSState() {
  const context = useContext(OSStateContext);

  if (!context) {
    throw new Error("useOSState must be used inside OSStateProvider");
  }

  return context;
}