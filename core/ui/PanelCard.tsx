type PanelCardProps = {
  title?: string;
  children: React.ReactNode;
};

export default function PanelCard({ title, children }: PanelCardProps) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-4">
      {title && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </div>
      )}

      {children}
    </div>
  );
}