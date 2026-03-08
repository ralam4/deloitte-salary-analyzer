const STYLES = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warn: "bg-amber-50 text-amber-700 border-amber-100",
  bad: "bg-rose-50 text-rose-700 border-rose-100",
  neutral: "bg-violet-50 text-violet-700 border-violet-100",
};

export default function InsightChip({ text, type = "neutral" }) {
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full px-3 py-1 text-[12px] font-medium mr-1.5 mb-1.5 ${STYLES[type]}`}>
      {text}
    </span>
  );
}
