export default function CareerEmptyState({
  title = "Complete your Career Goal",
  detail = "Paths are generated after a goal and its guidance are saved.",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center">
      <div className="px-6 text-center">
        <div className="text-2xl font-semibold text-slate-900">
          {title}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          {detail}
        </div>
      </div>
    </div>
  );
}
