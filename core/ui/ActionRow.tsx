import { styles } from "@/core/design/styles";

type ActionRowProps = {
  label: string;
  value?: string;
  action?: string;
  onClick?: () => void;
};

export default function ActionRow({
  label,
  value,
  action,
  onClick,
}: ActionRowProps) {
  const content = (
    <>
      <span>{label}</span>

      {value && <span className={styles.text.value}>{value}</span>}

      {action && <span className={styles.text.value}>{action}</span>}
    </>
  );

  const className = `flex w-full justify-between px-3 py-2 ${styles.button.neutral}`;

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}