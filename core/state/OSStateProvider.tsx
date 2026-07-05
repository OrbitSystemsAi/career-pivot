"use client";

import { createContext, useContext, useEffect, useState } from "react";

type OSStateContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;

  activeView: string;
  setActiveView: (view: string) => void;

  resetWorkspace: () => void;
};

const OSStateContext = createContext<OSStateContextType | null>(null);

const DEFAULT_MODULE = "career";
const DEFAULT_VIEW = "graph";

const MODULE_STORAGE_KEY = "osai.activeModule";
const VIEW_STORAGE_KEY = "osai.activeView";

export function OSStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModule, setActiveModuleState] = useState(DEFAULT_MODULE);
  const [activeView, setActiveViewState] = useState(DEFAULT_VIEW);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedModule = window.localStorage.getItem(MODULE_STORAGE_KEY);
    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);

    if (storedModule) {
      setActiveModuleState(storedModule);
    }

    if (storedView) {
      setActiveViewState(storedView);
    }

    setHasLoadedStorage(true);
  }, []);

  function setActiveModule(module: string) {
    setActiveModuleState(module);
    window.localStorage.setItem(MODULE_STORAGE_KEY, module);
  }

  function setActiveView(view: string) {
    setActiveViewState(view);
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  }

  function resetWorkspace() {
    setActiveModuleState(DEFAULT_MODULE);
    setActiveViewState(DEFAULT_VIEW);

    window.localStorage.setItem(MODULE_STORAGE_KEY, DEFAULT_MODULE);
    window.localStorage.setItem(VIEW_STORAGE_KEY, DEFAULT_VIEW);
  }

  if (!hasLoadedStorage) {
    return null;
  }

  return (
    <OSStateContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeView,
        setActiveView,
        resetWorkspace,
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