export default function PercentileBar({ percentile }) {
  if (percentile == null) return null;
  const pct = Math.min(99, Math.max(1, percentile));
  const color =
    pct >= 75 ? "#22c55e" : pct >= 50 ? "#86efac" : pct >= 25 ? "#fbbf24" : "#f87171";

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1 text-xs text-slate-400">
        <span>P10</span><span>P25</span><span>P50</span><span>P75</span><span>P90</span>
      </div>
      <div className="relative h-3 bg-slate-800 rounded-full overflow-visible">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #334155, ${color})`,
            }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] border-slate-950 z-10"
          style={{
            left: `${pct}%`,
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {[10, 25, 50, 75, 90].map((p) => (
          <div key={p} className="w-0.5 h-1 bg-slate-700 mx-auto" />
        ))}
      </div>
    </div>
  );
}
