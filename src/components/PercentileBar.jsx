export default function PercentileBar({ percentile }) {
  if (percentile == null) return null;
  const pct = Math.min(99, Math.max(1, percentile));
  const color =
    pct >= 75 ? "#10b981" : pct >= 50 ? "#34d399" : pct >= 25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mt-3">
      <div className="flex justify-between mb-1.5 text-[10px] text-stone-400 font-medium tracking-wide">
        <span>P10</span><span>P25</span><span>P50</span><span>P75</span><span>P90</span>
      </div>
      <div className="relative h-2 bg-stone-100 rounded-full overflow-visible">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #e7e5e4, ${color})`,
            }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white z-10 shadow-md"
          style={{ left: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
