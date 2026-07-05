type SectionTitleProps = {
  children: React.ReactNode;
};

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </div>
  );
}