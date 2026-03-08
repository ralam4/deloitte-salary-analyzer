export default function PercentileBar({ percentile }) {
  if (percentile == null) return null;
  const pct = Math.min(99, Math.max(1, percentile));
  const color =
    pct >= 75 ? "#10b981" : pct >= 50 ? "#34d399" : pct >= 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-[11px] text-slate-400 font-medium">
        <span>P10</span><span>P25</span><span>P50</span><span>P75</span><span>P90</span>
      </div>
      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-visible">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #e2e8f0, ${color})`,
            }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[2.5px] border-white z-10"
          style={{
            left: `${pct}%`,
            background: color,
            boxShadow: `0 0 0 1px ${color}40, 0 2px 8px ${color}30`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {[10, 25, 50, 75, 90].map((p) => (
          <div key={p} className="w-px h-1 bg-slate-200 mx-auto" />
        ))}
      </div>
    </div>
  );
}
