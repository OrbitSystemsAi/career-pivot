type ActionRowProps = {
  label: string;
  value?: string;
  action?: string;
};

export default function ActionRow({ label, value, action }: ActionRowProps) {
  return (
    <button className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600">
      <span>{label}</span>

      {value && <span className="text-blue-600">{value}</span>}

      {action && <span className="text-blue-600">{action}</span>}
    </button>
  );
}