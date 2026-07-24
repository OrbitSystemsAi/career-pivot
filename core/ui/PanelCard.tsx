"use client";

import { createContext, useContext } from "react";
import { styles } from "@/core/design/styles";

const PanelCardRailContext = createContext(false);

export function PanelCardRailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelCardRailContext.Provider value={true}>
      {children}
    </PanelCardRailContext.Provider>
  );
}

type PanelCardProps = {
  title: string;
  titleAction?: React.ReactNode;
  children: React.ReactNode;
};

export default function PanelCard({
  title,
  titleAction,
  children,
}: PanelCardProps) {
  const isRailSection = useContext(PanelCardRailContext);

  if (isRailSection) {
    return (
      <details className="group border-b border-slate-200 last:border-b-0">
        <summary
          className={`${styles.button.railHeader} cursor-pointer list-none marker:hidden`}
        >
          <h3 className="font-normal normal-case tracking-normal">{title}</h3>

          <div className="flex items-center gap-2">
            {titleAction && (
              <span
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                {titleAction}
              </span>
            )}

            <span className="text-xs text-slate-400 transition group-open:rotate-180">
              ⌄
            </span>
          </div>
        </summary>

        <div className="d4-section-body bg-white px-4 pb-4 pt-3 text-[#173a46]">
          {children}
        </div>
      </details>
    );
  }

  return (
    <section className={`h-full overflow-hidden ${styles.surface.panel}`}>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className={styles.text.label}>{title}</h3>

        {titleAction}
      </div>

      <div className="h-[calc(100%-2.75rem)] overflow-auto p-4">
        {children}
      </div>
    </section>
  );
}
