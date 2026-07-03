import { networkScore } from "../data/networkData";

export default function NetworkModule() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl font-bold text-blue-600">
          {networkScore.score}%
        </div>

        <div className="mt-3 text-sm font-medium text-slate-700">
          Network Alignment
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Target: {networkScore.target}
        </div>

        <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600">
          {networkScore.alignment} improvement available
        </div>
      </div>
    </div>
  );
}