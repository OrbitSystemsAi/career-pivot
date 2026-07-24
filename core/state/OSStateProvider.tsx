"use client";

import { createContext, useContext, useEffect, useState } from "react";

type OSStateContextType = {
  activeModule: string;
  setActiveModule: (module: string) => void;

  activeView: string;
  setActiveView: (view: string) => void;

  isD5Open: boolean;
  setIsD5Open: (isOpen: boolean) => void;

  homeLayoutId: HomeLayoutId;
  setHomeLayoutId: (layoutId: HomeLayoutId) => void;
};

export type HomeLayoutId =
  | "career-editorial"
  | "social-journal"
  | "left-rail"
  | "featured-story"
  | "post-stream"
  | "milestone"
  | "portfolio"
  | "community"
  | "career-chronicle"
  | "goals-growth"
  | "profile-magazine"
  | "network-desk";

const OSStateContext = createContext<OSStateContextType | null>(null);

const DEFAULT_MODULE = "home";
const DEFAULT_VIEW = "overview";
const DEFAULT_D5_OPEN = false;
const DEFAULT_HOME_LAYOUT: HomeLayoutId = "career-editorial";

const MODULE_STORAGE_KEY = "osai.activeModule";
const VIEW_STORAGE_KEY = "osai.activeView";
const D5_STORAGE_KEY = "osai.isD5Open";
const HOME_LAYOUT_STORAGE_KEY = "osai.homeLayout";

const homeLayoutIds = new Set<HomeLayoutId>([
  "career-editorial",
  "social-journal",
  "left-rail",
  "featured-story",
  "post-stream",
  "milestone",
  "portfolio",
  "community",
  "career-chronicle",
  "goals-growth",
  "profile-magazine",
  "network-desk",
]);

export function OSStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModule, setActiveModuleState] = useState(DEFAULT_MODULE);
  const [activeView, setActiveViewState] = useState(DEFAULT_VIEW);
  const [isD5Open, setIsD5OpenState] = useState(DEFAULT_D5_OPEN);
  const [homeLayoutId, setHomeLayoutIdState] = useState<HomeLayoutId>(DEFAULT_HOME_LAYOUT);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedModule = window.localStorage.getItem(MODULE_STORAGE_KEY);
    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const storedD5Open = window.localStorage.getItem(D5_STORAGE_KEY);
    const storedHomeLayout = window.localStorage.getItem(HOME_LAYOUT_STORAGE_KEY);

    if (storedModule) {
      // Intentional one-time hydration from the browser persistence boundary.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveModuleState(storedModule);
    }

    if (storedView) {
      setActiveViewState(storedView);
    }

    if (storedD5Open) {
      setIsD5OpenState(storedD5Open === "true");
    }

    if (storedHomeLayout && homeLayoutIds.has(storedHomeLayout as HomeLayoutId)) {
      setHomeLayoutIdState(storedHomeLayout as HomeLayoutId);
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

  function setHomeLayoutId(layoutId: HomeLayoutId) {
    setHomeLayoutIdState(layoutId);
    window.localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, layoutId);
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
        homeLayoutId,
        setHomeLayoutId,
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
