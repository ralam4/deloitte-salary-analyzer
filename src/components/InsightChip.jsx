const COLORS = {
  good: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  warn: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  bad: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  neutral: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
};

export default function InsightChip({ text, type = "neutral" }) {
  const c = COLORS[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} border ${c.border} ${c.text} rounded-full px-3.5 py-1.5 text-[13px] font-medium mr-1.5 mb-1.5`}
    >
      {text}
    </span>
  );
}
