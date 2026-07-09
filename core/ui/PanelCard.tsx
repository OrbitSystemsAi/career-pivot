import { styles } from "@/core/design/styles";

type PanelCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function PanelCard({ title, children }: PanelCardProps) {
  return (
    <section className={`h-full overflow-hidden ${styles.surface.panel}`}>
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className={styles.text.label}>{title}</h3>
      </div>

      <div className="h-[calc(100%-2.75rem)] overflow-auto p-4">
        {children}
      </div>
    </section>
  );
}