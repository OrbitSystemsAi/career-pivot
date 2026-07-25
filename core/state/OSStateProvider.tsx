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
  publisherLayoutId: HomeLayoutId;
  setPublisherLayoutId: (layoutId: HomeLayoutId) => void;
  readingLayoutId: HomeLayoutId;
  setReadingLayoutId: (layoutId: HomeLayoutId) => void;
  readingLayoutPreference: ReadingLayoutPreference;
  setReadingLayoutPreference: (preference: ReadingLayoutPreference) => void;
};

export type ReadingLayoutPreference = "publisher" | "personal";

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
const PUBLISHER_LAYOUT_STORAGE_KEY = "osai.publisherLayout";
const READING_LAYOUT_STORAGE_KEY = "osai.readingLayout";
const READING_PREFERENCE_STORAGE_KEY = "osai.readingLayoutPreference";

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
  const [readingLayoutId, setReadingLayoutIdState] = useState<HomeLayoutId>(DEFAULT_HOME_LAYOUT);
  const [readingLayoutPreference, setReadingLayoutPreferenceState] = useState<ReadingLayoutPreference>("publisher");
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedModule = window.localStorage.getItem(MODULE_STORAGE_KEY);
    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const storedD5Open = window.localStorage.getItem(D5_STORAGE_KEY);
    const storedHomeLayout = window.localStorage.getItem(HOME_LAYOUT_STORAGE_KEY);
    const storedPublisherLayout = window.localStorage.getItem(PUBLISHER_LAYOUT_STORAGE_KEY);
    const storedReadingLayout = window.localStorage.getItem(READING_LAYOUT_STORAGE_KEY);
    const storedReadingPreference = window.localStorage.getItem(READING_PREFERENCE_STORAGE_KEY);

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

    const resolvedPublisherLayout = storedPublisherLayout ?? storedHomeLayout;
    if (resolvedPublisherLayout && homeLayoutIds.has(resolvedPublisherLayout as HomeLayoutId)) {
      setHomeLayoutIdState(resolvedPublisherLayout as HomeLayoutId);
    }

    if (storedReadingLayout && homeLayoutIds.has(storedReadingLayout as HomeLayoutId)) {
      setReadingLayoutIdState(storedReadingLayout as HomeLayoutId);
    }

    if (storedReadingPreference === "publisher" || storedReadingPreference === "personal") {
      setReadingLayoutPreferenceState(storedReadingPreference);
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
    window.localStorage.setItem(PUBLISHER_LAYOUT_STORAGE_KEY, layoutId);
  }

  function setReadingLayoutId(layoutId: HomeLayoutId) {
    setReadingLayoutIdState(layoutId);
    window.localStorage.setItem(READING_LAYOUT_STORAGE_KEY, layoutId);
  }

  function setReadingLayoutPreference(preference: ReadingLayoutPreference) {
    setReadingLayoutPreferenceState(preference);
    window.localStorage.setItem(READING_PREFERENCE_STORAGE_KEY, preference);
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
        publisherLayoutId: homeLayoutId,
        setPublisherLayoutId: setHomeLayoutId,
        readingLayoutId,
        setReadingLayoutId,
        readingLayoutPreference,
        setReadingLayoutPreference,
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
