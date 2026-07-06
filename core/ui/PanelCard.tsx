type PanelCardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function PanelCard({ title, children }: PanelCardProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4">
      {title && (
        <div className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}