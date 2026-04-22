export default function StatCard({ label, value, sub, accent = "#2563eb", highlight = false }) {
  return (
    <div
      className={`relative bg-white rounded-md p-4 border transition-colors ${
        highlight ? "border-accent-500/60" : "border-slate-200"
      }`}
    >
      <div
        className="absolute top-0 left-0 h-full w-[2px]"
        style={{ background: highlight ? "#f97316" : accent }}
      />
      <div className="pl-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-[0.14em] font-semibold mb-1">
          {label}
        </div>
        <div className="text-2xl sm:text-[26px] font-semibold text-slate-900 font-mono tabular-nums tracking-tight leading-none">
          {value}
        </div>
        {sub && <div className="text-[11px] text-slate-500 mt-1.5 font-mono tabular-nums">{sub}</div>}
      </div>
    </div>
  );
}
