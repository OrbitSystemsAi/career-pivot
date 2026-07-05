"use client";

import { useState } from "react";
import D5BottomCenterPanel from "../panels/D5BottomCenterPanel";
import D5BottomLeftPanel from "../panels/D5BottomLeftPanel";
import D5BottomRightPanel from "../panels/D5BottomRightPanel";

export default function D5BottomWorkspaceFrame() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="absolute bottom-4 left-4 right-4 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between border-b border-slate-200 px-4 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:bg-blue-50 hover:text-blue-600"
      >
        <span>D5 Intelligence Workspace</span>
        <span>{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen && (
        <div className="grid h-56 grid-cols-3 gap-4 p-4">
          <D5BottomLeftPanel />
          <D5BottomCenterPanel />
          <D5BottomRightPanel />
        </div>
      )}
    </section>
  );
}