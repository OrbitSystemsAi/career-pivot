"use client";

import { createContext, useContext, useEffect, useState } from "react";

type OSStateContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;

  activeView: string;
  setActiveView: (view: string) => void;

  isD5Open: boolean;
  setIsD5Open: (isOpen: boolean) => void;
};

const OSStateContext = createContext<OSStateContextType | null>(null);

const DEFAULT_MODULE = "career";
const DEFAULT_VIEW = "graph";
const DEFAULT_D5_OPEN = false;

const MODULE_STORAGE_KEY = "osai.activeModule";
const VIEW_STORAGE_KEY = "osai.activeView";
const D5_STORAGE_KEY = "osai.isD5Open";

export function OSStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModule, setActiveModuleState] = useState(DEFAULT_MODULE);
  const [activeView, setActiveViewState] = useState(DEFAULT_VIEW);
  const [isD5Open, setIsD5OpenState] = useState(DEFAULT_D5_OPEN);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedModule = window.localStorage.getItem(MODULE_STORAGE_KEY);
    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const storedD5Open = window.localStorage.getItem(D5_STORAGE_KEY);

    if (storedModule) {
      setActiveModuleState(storedModule);
    }

    if (storedView) {
      setActiveViewState(storedView);
    }

    if (storedD5Open) {
      setIsD5OpenState(storedD5Open === "true");
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

  function setIsD5Open(isOpen: boolean) {
    setIsD5OpenState(isOpen);
    window.localStorage.setItem(D5_STORAGE_KEY, String(isOpen));
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
        isD5Open,
        setIsD5Open,
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