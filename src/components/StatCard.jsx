export default function StatCard({ label, value, sub, accent = "#6366f1" }) {
  return (
    <div
      className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 transition-all hover:bg-white/80 hover:shadow-lg hover:shadow-black/[0.03]"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1.5">{sub}</div>}
    </div>
  );
}
