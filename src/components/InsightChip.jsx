const STYLES = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  bad: "bg-rose-50 text-rose-700 border-rose-200",
  neutral: "bg-brand-50 text-brand-700 border-brand-200",
};

export default function InsightChip({ text, type = "neutral" }) {
  return (
    <span className={`inline-flex items-center border rounded-sm px-2 py-1 text-[11px] font-medium font-mono tabular-nums mr-1.5 mb-1.5 ${STYLES[type]}`}>
      {text}
    </span>
  );
}
