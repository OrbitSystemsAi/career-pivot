export const styles = {
  surface: {
    app: "bg-[#f7f8fb] text-slate-900",
    workspace:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(224,247,250,0.65),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f6f8fb_45%,#eef7fb_100%)]",
    panel: "rounded-[1.5rem] border border-slate-200 bg-white shadow-sm",
    panelSoft:
      "rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.04)]",
  },

  button: {
    base: "rounded-xl text-xs transition",
    neutral:
      "rounded-xl text-xs text-slate-500 transition hover:bg-blue-50 hover:text-slate-900",
    selected: "rounded-xl bg-blue-50 text-xs text-slate-900 transition",
    bordered:
      "rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 transition hover:bg-blue-50 hover:text-slate-900",
    disabled:
      "cursor-not-allowed rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-300",
  },

  text: {
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
};