"use client";

import D5BottomCenterPanel from "../panels/D5BottomCenterPanel";
import D5BottomLeftPanel from "../panels/D5BottomLeftPanel";
import D5BottomRightPanel from "../panels/D5BottomRightPanel";

type D5BottomWorkspaceFrameProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function D5BottomWorkspaceFrame({
  isOpen,
  onToggle,
}: D5BottomWorkspaceFrameProps) {
  return (
    <section className="absolute bottom-5 left-6 right-6 z-50 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
      <button
        onClick={onToggle}
        className="flex h-12 w-full items-center justify-between border-b border-slate-100 px-5 text-xs font-bold uppercase tracking-wide text-slate-400 hover:bg-blue-50 hover:text-blue-600"
      >
        <span>D5 Intelligence Workspace</span>
        <span>{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen && (
        <div className="grid h-56 grid-cols-3 gap-5 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-5">
          <D5BottomLeftPanel />
          <D5BottomCenterPanel />
          <D5BottomRightPanel />
        </div>
      )}
    </section>
  );
}