export const styles = {
  surface: {
    app: "bg-white text-slate-900",
    workspace:
      "bg-transparent",
    shellPanel:
      "rounded-[1.75rem] border border-[#b7cbd0] bg-white shadow-[0_18px_60px_rgba(5,35,43,0.18)]",
    panel: "rounded-[1.5rem] border border-slate-200 bg-white shadow-sm",
    panelSoft:
      "rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.04)]",
    documentPage:
      "mx-auto min-h-[1056px] w-full max-w-[816px] rounded-sm border border-slate-200 bg-white px-12 py-10 shadow-sm print:mx-0 print:max-w-none print:border-0 print:shadow-none",
  },

  layout: {
    appShell: "flex h-screen w-screen flex-col overflow-hidden",
    main:
      "grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_16rem] gap-0 overflow-hidden pr-0",
    d4: "h-full min-h-0 overflow-hidden",
    d5:
      "relative z-50 overflow-hidden border border-[#416b75] bg-[#1b414c] text-white shadow-[0_24px_80px_rgba(5,35,43,0.24)]",
  },

  button: {
    base: "rounded-xl text-xs transition",
    neutral:
      "rounded-xl text-xs text-slate-500 transition hover:bg-blue-50 hover:text-slate-900",
    selected: "rounded-xl bg-blue-50 text-xs text-slate-900 transition",
    bordered:
      "rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 transition hover:bg-blue-50 hover:text-slate-900",
    borderedSelected:
      "rounded-xl border border-slate-200 bg-blue-50 px-3 py-2 text-xs text-slate-900 transition",
    disabled:
      "cursor-not-allowed rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-300",
    nav:
      "flex h-9 w-full items-center justify-start px-6 py-2 text-left text-xs transition",
    railHeader:
      "flex h-9 w-full items-center justify-between px-3 py-2 text-xs transition",
    navSelected:
      "bg-[#dceff2] text-[#123743] shadow-[inset_4px_0_0_#fb923c]",
    navDefault: "text-[#405d65] hover:bg-[#eef6f7] hover:text-[#123743]",
    tab: "rounded-xl px-4 py-2 text-xs transition",
    tabSelected: "border-b-2 border-orange-400 text-[#123743]",
    tabDefault: "text-slate-500 hover:bg-[#e8f2f3] hover:text-[#123743]",
  },

  text: {
    title: "text-sm text-slate-900",
    label: "text-xs uppercase tracking-wide text-slate-400",
    body: "text-sm text-slate-700",
    muted: "text-xs text-slate-500",
    value: "text-slate-900",
  },

  list: {
    container: "flex flex-col gap-1",
    row:
      "grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-xl px-3 py-2 text-xs transition",
    rowSelected: "bg-blue-50 text-slate-900",
    rowDefault: "text-slate-500 hover:bg-blue-50 hover:text-slate-900",
    rowText: "truncate text-left",
    rowMeta: "text-slate-400",
    rowAction: "text-slate-500 hover:text-slate-900",
    rowMuted: "text-slate-300",
    divider: "mt-3 border-t border-slate-100 pt-3",
  },

  document: {
    toolbar:
      "sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3",
    canvas: "bg-slate-100 px-8 py-6",
    preview:
      "resume-preview text-sm leading-7 text-slate-800 [&_a]:text-slate-900 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-3 [&_strong]:font-bold [&_table]:w-full [&_td]:align-top",
  },
};
