export default function StatCard({ label, value, sub, accent = "#6366f1" }) {
  return (
    <div
      className="bg-surface-card backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 sm:p-5 transition-all hover:border-white/10"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-slate-100 font-mono">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
