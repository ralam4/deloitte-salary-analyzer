const COLORS = {
  good: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300" },
  warn: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-200" },
  bad: { bg: "bg-red-400/10", border: "border-red-400/30", text: "text-red-300" },
  neutral: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-300" },
};

export default function InsightChip({ text, type = "neutral" }) {
  const c = COLORS[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} border ${c.border} ${c.text} rounded-full px-3.5 py-1.5 text-[13px] mr-1.5 mb-1.5`}
    >
      {text}
    </span>
  );
}
