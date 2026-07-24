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
        className="flex h-12 w-full items-center justify-between border-b border-[#416b75] px-5 text-xs uppercase tracking-wide text-[#c6d7da] hover:bg-[#275a65] hover:text-white"
      >
        <span>D5 Intelligence Workspace</span>
        <span>{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen && (
        <div className="grid h-56 grid-cols-3 gap-5 bg-[linear-gradient(145deg,#173a46,#214f5b)] p-5">
          <D5BottomLeftPanel />
          <D5BottomCenterPanel />
          <D5BottomRightPanel />
        </div>
      )}
    </section>
  );
}
