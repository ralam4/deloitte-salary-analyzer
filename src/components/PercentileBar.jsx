export default function PercentileBar({ percentile }) {
  if (percentile == null) return null;
  const pct = Math.min(99, Math.max(1, percentile));
  const color =
    pct >= 75 ? "#16a34a" : pct >= 50 ? "#2563eb" : pct >= 25 ? "#f97316" : "#dc2626";

  return (
    <div className="mt-3">
      <div className="flex justify-between mb-1.5 text-[10px] text-slate-400 font-mono tabular-nums tracking-wide">
        <span>P10</span><span>P25</span><span>P50</span><span>P75</span><span>P90</span>
      </div>
      <div className="relative h-1.5 bg-slate-100 rounded-sm overflow-visible">
        <div className="absolute inset-0 rounded-sm overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: color,
            }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-sm border-2 border-white z-10"
          style={{ left: `${pct}%`, background: color, boxShadow: "0 0 0 1px rgba(15,23,42,0.12)" }}
        />
      </div>
    </div>
  );
}
