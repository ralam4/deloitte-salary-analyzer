export default function StatCard({ label, value, sub, accent = "#6366f1" }) {
  return (
    <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 hover:border-stone-300/80 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/40 hover:-translate-y-0.5">
      <div
        className="absolute top-0 left-6 w-8 h-[3px] rounded-b-full"
        style={{ background: accent }}
      />
      <div className="text-[10px] text-stone-400 uppercase tracking-[0.12em] font-semibold mb-2">
        {label}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono tracking-tight leading-none">
        {value}
      </div>
      {sub && <div className="text-[11px] text-stone-400 mt-2 font-medium">{sub}</div>}
    </div>
  );
}
