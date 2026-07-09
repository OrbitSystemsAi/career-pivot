"use client";

import { styles } from "@/core/design/styles";
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
    <section className={styles.layout.d5}>
      <button
        onClick={onToggle}
        className="flex h-12 w-full items-center justify-between border-b border-slate-100 px-5 text-xs uppercase tracking-wide text-slate-500 hover:bg-blue-50 hover:text-slate-900"
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