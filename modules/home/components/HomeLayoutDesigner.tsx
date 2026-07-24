"use client";

import { useEffect, useState } from "react";
import { useOSState, type HomeLayoutId } from "@/core/state/OSStateProvider";

type LayoutOption = {
  id: HomeLayoutId;
  name: string;
  description: string;
  frames: string[];
  defaults: string[];
  gridClass: string;
  frameClasses: string[];
};

const layoutOptions: LayoutOption[] = [
  {
    id: "career-editorial",
    name: "Career Editorial",
    description: "A profile rail, defining story, highlights, and activity",
    frames: ["Profile rail", "Career story", "Highlights", "Recent activity"],
    defaults: ["Profile", "Career story", "Career highlights", "Social activity"],
    gridClass: "grid-cols-[.62fr_1.6fr_1fr] grid-rows-2",
    frameClasses: ["row-span-2", "col-span-2", "", ""],
  },
  {
    id: "social-journal",
    name: "Social Journal",
    description: "Career narrative meets a featured post and connections",
    frames: ["Career intro", "Connections", "Featured post", "Network topics"],
    defaults: ["Text highlight", "Friends & connections", "Featured post", "Community activity"],
    gridClass: "grid-cols-[1.6fr_.8fr] grid-rows-[.55fr_1fr]",
    frameClasses: ["", "row-span-2", "", ""],
  },
  {
    id: "left-rail",
    name: "Left Rail",
    description: "A persistent identity column beside posts and community",
    frames: ["Identity rail", "Career statement", "Latest post", "Connections", "Activity"],
    defaults: ["Profile", "Text highlight", "Recent posts", "Friends & connections", "Social activity"],
    gridClass: "grid-cols-[.65fr_1.5fr_.8fr] grid-rows-2",
    frameClasses: ["row-span-2", "col-span-2", "", "", ""],
  },
  {
    id: "featured-story",
    name: "Featured Story",
    description: "One bold career story supported by text and milestones",
    frames: ["Feature visual", "Feature text", "Milestones"],
    defaults: ["Featured visual", "Career story", "Career milestones"],
    gridClass: "grid-cols-[1.25fr_1fr_.7fr] grid-rows-1",
    frameClasses: ["", "", ""],
  },
  {
    id: "post-stream",
    name: "Post Stream",
    description: "A social publishing feed grounded by career context",
    frames: ["Post feed", "Connections", "Network topics"],
    defaults: ["Post stream", "Friends & connections", "Community activity"],
    gridClass: "grid-cols-[1.65fr_.75fr] grid-rows-2",
    frameClasses: ["row-span-2", "", ""],
  },
  {
    id: "milestone",
    name: "Milestone",
    description: "A vertical career history with a post and key skills",
    frames: ["Milestone rail", "Featured post", "Top skills"],
    defaults: ["Career milestones", "Featured post", "Skills"],
    gridClass: "grid-cols-[.72fr_1.45fr_.72fr] grid-rows-1",
    frameClasses: ["", "", ""],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "A profile rail beside selected work and proof",
    frames: ["Profile rail", "Selected work", "Proof strip"],
    defaults: ["Profile", "Portfolio work", "Proof points"],
    gridClass: "grid-cols-[.65fr_1.8fr] grid-rows-[1fr_.42fr]",
    frameClasses: ["row-span-2", "", ""],
  },
  {
    id: "community",
    name: "Community",
    description: "Community identity, conversations, and shared posts",
    frames: ["Community rail", "Community posts", "Member activity"],
    defaults: ["Community profile", "Community posts", "Friends & connections"],
    gridClass: "grid-cols-[.7fr_1.8fr] grid-rows-[1fr_.55fr]",
    frameClasses: ["row-span-2", "", ""],
  },
  {
    id: "career-chronicle",
    name: "Career Chronicle",
    description: "A personal rail, career timeline, and recent posts",
    frames: ["Profile rail", "Career chronicle", "Recent posts", "Team moments"],
    defaults: ["Profile", "Experience timeline", "Recent posts", "Social activity"],
    gridClass: "grid-cols-[.65fr_1.45fr_.8fr] grid-rows-2",
    frameClasses: ["row-span-2", "row-span-2", "", ""],
  },
  {
    id: "goals-growth",
    name: "Goals & Growth",
    description: "Goal progress, learning, milestones, and inspiration",
    frames: ["Goals", "Learning", "Goal visual", "Next milestone"],
    defaults: ["Goal progress", "Skills", "Featured visual", "Career milestones"],
    gridClass: "grid-cols-[1.4fr_.8fr_.8fr] grid-rows-2",
    frameClasses: ["row-span-2", "", "row-span-2", ""],
  },
  {
    id: "profile-magazine",
    name: "Profile Magazine",
    description: "A bold portrait lead with biography and capabilities",
    frames: ["Portrait rail", "About", "Capabilities", "Highlights"],
    defaults: ["Featured visual", "Career story", "Skills", "Career highlights"],
    gridClass: "grid-cols-[.8fr_1.5fr] grid-rows-3",
    frameClasses: ["row-span-3", "", "", ""],
  },
  {
    id: "network-desk",
    name: "Network Desk",
    description: "Connections, network activity, and opportunities together",
    frames: ["Top connections", "Network activity", "Opportunities"],
    defaults: ["Friends & connections", "Social activity", "Saved paths"],
    gridClass: "grid-cols-3 grid-rows-1",
    frameClasses: ["", "", ""],
  },
];

const visualOptions = [
  "Profile",
  "Career story",
  "Text highlight",
  "Career highlights",
  "Career milestones",
  "Career direction",
  "Experience timeline",
  "Recent posts",
  "Featured post",
  "Post stream",
  "Community posts",
  "Friends & connections",
  "Social activity",
  "Community activity",
  "Community profile",
  "Portfolio work",
  "Featured visual",
  "Goal progress",
  "Goals",
  "Skills",
  "Highlights",
  "Industry experience",
  "Readiness",
  "Proof points",
  "Saved paths",
];

function FramePreview({ option }: { option: LayoutOption }) {
  return (
    <div className={`grid h-32 gap-1.5 ${option.gridClass}`} aria-hidden="true">
      {option.frames.map((frame, index) => (
        <span
          className={`flex min-h-0 flex-col justify-center overflow-hidden rounded border border-[#c8d8dc] bg-[linear-gradient(145deg,#f9fcfd,#e8f2f3)] px-2 ${option.frameClasses[index] ?? ""}`}
          key={frame}
        >
          <small className="truncate text-[7px] font-semibold uppercase tracking-[.08em] text-[#64808a]">{option.defaults[index]}</small>
          <i className="mt-1 h-px w-4/5 bg-[#b8cdd2]" />
          <i className="mt-1 h-px w-3/5 bg-[#cfdee2]" />
        </span>
      ))}
    </div>
  );
}

export default function HomeLayoutDesigner() {
  const { homeLayoutId, setActiveView, setHomeLayoutId } = useOSState();
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption | null>(null);
  const [frameVisuals, setFrameVisuals] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedLayout) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedLayout(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedLayout]);

  function selectLayout(option: LayoutOption) {
    setSelectedLayout(option);
    setFrameVisuals(
      option.defaults,
    );
  }

  return (
      <section className="relative mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden" data-testid="layout-selector">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-7">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#123743]">Choose your home layout</h2>
          <p className="mt-2 text-sm leading-6 text-[#667c84]">Choose from 12 magazine-inspired ways to tell your career story, share posts, and show your connections.</p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layoutOptions.map((option) => (
            <button
              aria-current={option.id === homeLayoutId ? "true" : undefined}
              className={`group rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#168391] hover:shadow-[0_16px_36px_rgba(15,48,64,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d4eef1] ${option.id === homeLayoutId ? "border-2 border-[#168391] shadow-[0_0_0_3px_#d4eef1,0_12px_32px_rgba(15,48,64,0.1)]" : "border-[#c8d8dc] shadow-[0_12px_32px_rgba(15,48,64,0.06)]"}`}
              key={option.id}
              onClick={() => selectLayout(option)}
              type="button"
            >
              <FramePreview option={option} />
              <span className="mt-4 block text-sm font-semibold text-[#173a46] group-hover:text-[#0e7886]">{option.name}</span>
              {option.id === homeLayoutId ? <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.12em] text-[#168391]">Current layout</span> : null}
              <span className="mt-1 block text-xs leading-5 text-[#70838a]">{option.description}</span>
            </button>
          ))}
        </div>
        </div>

        {selectedLayout ? (
          <div
            aria-labelledby="layout-configurator-title"
            aria-modal="true"
            className="absolute inset-3 z-30 flex items-center justify-center overflow-hidden rounded-2xl bg-[#102f39]/45 p-4 backdrop-blur-[2px]"
            data-testid="layout-configurator"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelectedLayout(null);
            }}
            role="dialog"
          >
            <div className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#bfd4d9] bg-white p-5 shadow-[0_24px_70px_rgba(15,48,64,0.28)] sm:p-6">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <button
            className="text-sm font-semibold text-[#168391] transition hover:text-[#ff7a00] focus:outline-none focus-visible:text-[#ff7a00]"
            onClick={() => {
              setSelectedLayout(null);
            }}
            type="button"
          >
            ← Back to layouts
          </button>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#123743]" id="layout-configurator-title">Configure your frames</h2>
          <p className="mt-2 text-sm text-[#667c84]">{selectedLayout.name} layout · choose what appears in each frame.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl bg-[#ff7a00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#db6700] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd8b7]"
            onClick={() => {
              setHomeLayoutId(selectedLayout.id);
              setSelectedLayout(null);
              setActiveView("overview");
            }}
            type="button"
          >
            Save layout
          </button>
        </div>
      </div>

      <div className={`mt-5 grid min-h-0 flex-1 gap-3 overflow-y-auto rounded-2xl border border-[#c8d8dc] bg-[#f8fbfc] p-4 ${selectedLayout.gridClass}`}>
        {selectedLayout.frames.map((frame, index) => (
          <label
            className={`flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-[#a9c3ca] bg-white p-4 text-center shadow-sm ${selectedLayout.frameClasses[index] ?? ""}`}
            key={frame}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a9097]">{frame}</span>
            <select
              aria-label={`${frame} visual`}
              className="mt-3 w-full max-w-52 rounded-lg border border-[#c8d8dc] bg-white px-3 py-2 text-center text-sm font-semibold text-[#173a46] outline-none focus:border-[#168391] focus:ring-4 focus:ring-[#e8f2f3]"
              onChange={(event) => setFrameVisuals((current) => current.map((value, frameIndex) => frameIndex === index ? event.target.value : value))}
              value={frameVisuals[index] ?? visualOptions[0]}
            >
              {visualOptions.map((visual) => <option key={visual}>{visual}</option>)}
            </select>
          </label>
        ))}
      </div>
            </div>
          </div>
        ) : null}
      </section>
  );
}
