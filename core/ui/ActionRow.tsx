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

      {value && <span className="text-slate-900">{value}</span>}

      {action && <span className="text-slate-900">{action}</span>}
    </>
  );

  const className =
    "flex w-full justify-between rounded-xl px-3 py-2 text-xs text-slate-500 hover:bg-blue-50 hover:text-slate-900";

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}