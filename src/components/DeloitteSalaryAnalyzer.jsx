import { useState, useMemo } from "react";
import PercentileBar from "./PercentileBar";
import StatCard from "./StatCard";
import InsightChip from "./InsightChip";
import BenchmarkChart from "./BenchmarkChart";

// Stats computed from 2025 Deloitte Salary Survey Responses.xlsx (1,775 clean rows of 1,934 total)
const LEVEL_STATS = {
  "Analyst / Jr Staff": {
    count: 80,
    salary: { p10: 73470, p25: 87775, p50: 94000, p75: 99075, p90: 102500, mean: 91228 },
    aip: { p25: 4900, p50: 4900, p75: 4900, mean: 4900 },
    tc: { p25: 87775, p50: 94700, p75: 100225 },
  },
  "Consultant / Staff": {
    count: 391,
    salary: { p10: 93500, p25: 99600, p50: 106300, p75: 115400, p90: 121200, mean: 107428 },
    aip: { p25: 4800, p50: 7000, p75: 10200, mean: 7823 },
    tc: { p25: 104050, p50: 113750, p75: 125325 },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    count: 577,
    salary: { p10: 113560, p25: 121000, p50: 137000, p75: 151800, p90: 175940, mean: 138238 },
    aip: { p25: 8000, p50: 12000, p75: 15900, mean: 12566 },
    tc: { p25: 132800, p50: 150000, p75: 168200 },
  },
  "Manager / Specialist Master": {
    count: 515,
    salary: { p10: 147900, p25: 162900, p50: 186500, p75: 204000, p90: 215460, mean: 182712 },
    aip: { p25: 16275, p50: 24050, p75: 33525, mean: 26106 },
    tc: { p25: 185225, p50: 211350, p75: 236950 },
  },
  "Senior Manager / Specialist Leader": {
    count: 202,
    salary: { p10: 186910, p25: 216050, p50: 232750, p75: 254300, p90: 271870, mean: 231234 },
    aip: { p25: 27250, p50: 44200, p75: 53475, mean: 43278 },
    tc: { p25: 250500, p50: 279600, p75: 309375 },
  },
};

const LEVELS = Object.keys(LEVEL_STATS);
const BUSINESSES = ["Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"];
const PORTFOLIOS = ["Strategy & Analytics", "Core Business Operations", "Cyber & Strategic Risk", "Cyber", "Human Capital", "Customer", "Finance Transformation", "Enterprise Performance", "Mergers & Acquisitions", "Regulatory, Risk & Forensic", "AI & Engineering", "Other"];
const GPS_COMM = ["Commercial", "GPS"];
const RATINGS = ["Exceptional", "Strong", "Meets Expectations"];

export const fmt = (n) => {
  if (n == null) return "N/A";
  const abs = Math.abs(Math.round(n));
  const formatted = `$${abs.toLocaleString()}`;
  return n < 0 ? `-${formatted}` : formatted;
};

const fmtPct = (n) => (n != null ? `${(n * 100).toFixed(1)}%` : "N/A");

function getPercentile(value, level) {
  const s = LEVEL_STATS[level]?.salary;
  if (!s || !value) return null;
  if (value <= s.p10) return 10;
  if (value <= s.p25) return Math.round(10 + 15 * (value - s.p10) / (s.p25 - s.p10));
  if (value <= s.p50) return Math.round(25 + 25 * (value - s.p25) / (s.p50 - s.p25));
  if (value <= s.p75) return Math.round(50 + 25 * (value - s.p50) / (s.p75 - s.p50));
  if (value <= s.p90) return Math.round(75 + 15 * (value - s.p75) / (s.p90 - s.p75));
  return Math.min(99, 90 + Math.round(10 * (value - s.p90) / (s.p90 - s.p75)));
}

const totalRespondents = Object.values(LEVEL_STATS).reduce((s, v) => s + v.count, 0);

const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all placeholder:text-stone-300 font-sans";
const labelClasses = "text-[10px] text-stone-400 uppercase tracking-[0.12em] mb-1.5 block font-semibold";

export default function DeloitteSalaryAnalyzer() {
  const [step, setStep] = useState(0); // 0=hero, 1=form, 2=results
  const [form, setForm] = useState({
    level: "", salary: "", newSalary: "", aip: "",
    business: "", portfolio: "", gpsComm: "",
    yearsDeloitte: "", yearsLevel: "", totalYears: "", rating: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const analysis = useMemo(() => {
    if (!form.level || !form.salary) return null;
    const currentSal = parseFloat(form.salary);
    if (!Number.isFinite(currentSal) || currentSal <= 0) return null;
    const rawNew = parseFloat(form.newSalary);
    const newSal = Number.isFinite(rawNew) && rawNew > 0 ? rawNew : null;
    const benchmarkSal = newSal || currentSal;
    const rawAip = parseFloat(form.aip);
    const aip = Number.isFinite(rawAip) && rawAip >= 0 ? rawAip : 0;
    const tc = benchmarkSal + aip;
    const raiseRate = newSal && currentSal > 0 ? (newSal - currentSal) / currentSal : null;
    const stats = LEVEL_STATS[form.level];
    if (!stats) return null;

    const sal = benchmarkSal;
    const pct = getPercentile(sal, form.level);
    const vsMedian = sal - stats.salary.p50;
    const vsMedianPct = vsMedian / stats.salary.p50;

    const insights = [];
    if (pct >= 75) insights.push({ text: `Top ${100 - pct}% earner at your level`, type: "good" });
    else if (pct >= 50) insights.push({ text: `Above median — ${pct}th percentile`, type: "good" });
    else if (pct >= 25) insights.push({ text: `Below median — ${pct}th percentile`, type: "warn" });
    else insights.push({ text: `Bottom quartile — ${pct}th percentile`, type: "bad" });

    if (vsMedian > 0) insights.push({ text: `+${fmt(vsMedian)} above median`, type: "good" });
    else if (vsMedian < 0) insights.push({ text: `${fmt(vsMedian)} below median`, type: "bad" });

    if (raiseRate !== null) {
      if (raiseRate >= 0.10) insights.push({ text: `Strong raise: +${fmtPct(raiseRate)} YoY`, type: "good" });
      else if (raiseRate >= 0.06) insights.push({ text: `Solid raise: +${fmtPct(raiseRate)} YoY`, type: "good" });
      else if (raiseRate >= 0.03) insights.push({ text: `Modest raise: +${fmtPct(raiseRate)} YoY`, type: "warn" });
      else insights.push({ text: `Below avg raise: +${fmtPct(raiseRate)} YoY`, type: "bad" });
    }

    if (form.yearsLevel) {
      const yl = parseFloat(form.yearsLevel);
      if (yl >= 3 && pct < 60) insights.push({ text: `${yl} yrs at level — consider promotion timeline`, type: "warn" });
    }

    if (aip > 0 && form.aip) {
      const aipVsMedian = aip - stats.aip.p50;
      if (aipVsMedian > 0) insights.push({ text: `AIP ${fmt(aip)} — +${fmt(aipVsMedian)} above median`, type: "good" });
      else insights.push({ text: `AIP ${fmt(aip)} — ${fmt(aipVsMedian)} vs median`, type: "warn" });
    }

    return { sal, aip, tc, pct, stats, vsMedian, vsMedianPct, raiseRate, insights, newSal, currentSal };
  }, [form]);

  const parsedSalary = parseFloat(form.salary);
  const canSubmit = form.level && form.salary && Number.isFinite(parsedSalary) && parsedSalary > 0;

  // ─── HERO / LANDING ───
  if (step === 0) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        {/* CSS mesh gradient background */}
        <div className="mesh-gradient animate-mesh-move fixed inset-0 -z-10" />
        <div className="fixed inset-0 bg-[#faf9f7]/50 -z-[5]" />
        <div className="grain-overlay" />

        {/* Nav */}
        <nav className="relative z-10 max-w-[1100px] mx-auto px-6 pt-8 flex items-center justify-between opacity-0 animate-fade-up">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-[13px] font-semibold text-stone-500 tracking-wide uppercase">Salary Analyzer</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[12px] text-stone-400 font-mono">{totalRespondents.toLocaleString()} respondents</span>
            <span className="text-[12px] text-stone-400">FY25 Data</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-24 sm:pt-32 pb-20">
          <div className="max-w-[720px]">
            <div className="opacity-0 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/80 border border-stone-200/60 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] text-stone-500 font-medium">Crowdsourced from Fishbowl — No Data Collected</span>
              </div>
            </div>

            <h1 className="opacity-0 animate-fade-up-1 font-serif text-5xl sm:text-7xl leading-[1.05] tracking-tight text-stone-900 mb-6">
              Know exactly where
              <br />
              <span className="italic text-violet-600">your comp</span> stands.
            </h1>

            <p className="opacity-0 animate-fade-up-2 text-lg sm:text-xl text-stone-400 leading-relaxed max-w-[540px] mb-10">
              Benchmark your Deloitte salary, bonus, and total compensation against {totalRespondents.toLocaleString()} verified US responses. See your percentile, compare raises, and understand your market position.
            </p>

            <div className="opacity-0 animate-fade-up-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(1)}
                className="bg-stone-900 text-white px-8 py-4 rounded-2xl text-[15px] font-semibold cursor-pointer transition-all hover:bg-stone-800 hover:-translate-y-0.5 shadow-xl shadow-stone-900/10 active:scale-[0.98]"
              >
                Analyze My Compensation
              </button>
              <a
                href="#how-it-works"
                className="text-stone-400 px-6 py-4 text-[15px] font-medium hover:text-stone-600 transition-colors text-center cursor-pointer"
              >
                How it works &darr;
              </a>
            </div>
          </div>

          {/* Floating stat preview cards */}
          <div className="opacity-0 animate-fade-up-4 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Median Base", level: "Analyst", val: "$94,000", sub: "80 responses" },
              { label: "Median Base", level: "Consultant", val: "$106,300", sub: "391 responses" },
              { label: "Median Base", level: "Manager", val: "$186,500", sub: "515 responses" },
              { label: "Median Base", level: "Sr. Manager", val: "$232,750", sub: "202 responses" },
            ].map((card) => (
              <div key={card.level} className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-4 sm:p-5 hover:bg-white/90 transition-all">
                <div className="text-[10px] text-stone-400 uppercase tracking-[0.1em] font-semibold">{card.level}</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-1 tracking-tight">{card.val}</div>
                <div className="text-[11px] text-stone-300 mt-1">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section */}
        <div id="how-it-works" className="relative z-10 border-t border-stone-200/60">
          <div className="max-w-[1100px] mx-auto px-6 py-20">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-12 tracking-tight">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "Enter your details",
                  desc: "Your level, salary, bonus, and years of experience. No data is collected — everything runs entirely in your browser.",
                },
                {
                  num: "02",
                  title: "Get benchmarked",
                  desc: "See exactly where you fall among peers at your level — your percentile, gap to median, and how your raise compares.",
                },
                {
                  num: "03",
                  title: "Make informed decisions",
                  desc: "Use real data from 1,765 verified responses to negotiate, plan your career trajectory, or understand your market value.",
                },
              ].map((s) => (
                <div key={s.num} className="group">
                  <div className="text-[11px] font-mono text-violet-400 font-medium mb-3">{s.num}</div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-stone-200/40">
              <p className="text-xs text-stone-400 max-w-[640px] leading-relaxed">
                This tool does not collect, store, or transmit any data — all analysis runs entirely in your browser. Compensation data is crowdsourced from the 2025 Deloitte salary survey on Fishbowl ({totalRespondents.toLocaleString()} US respondents, filtered for quality). Not affiliated with Deloitte. For informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  if (step === 1) {
    return (
      <div className="min-h-screen font-sans relative">
        <div className="mesh-gradient animate-mesh-move fixed inset-0 -z-10" />
        <div className="fixed inset-0 bg-[#faf9f7]/60 -z-[5]" />
        <div className="grain-overlay" />

        {/* Nav */}
        <nav className="relative z-10 max-w-[920px] mx-auto px-6 pt-8 pb-6 flex items-center justify-between">
          <button
            onClick={() => setStep(0)}
            className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <span>&larr;</span> Back
          </button>
          <span className="text-[12px] text-stone-300 font-mono">Step 1 of 2</span>
        </nav>

        <main className="relative z-10 max-w-[920px] mx-auto px-6 pb-16">
          <div className="mb-8 opacity-0 animate-fade-up">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight mb-2">
              Your compensation details
            </h1>
            <p className="text-stone-400 text-[15px]">
              Fill in what you know — only level and salary are required.
            </p>
          </div>

          <div className="opacity-0 animate-fade-up-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-violet-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Level & Role
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>FY26 Level *</label>
                  <select className={inputClasses} value={form.level} onChange={(e) => update("level", e.target.value)}>
                    <option value="">Select level...</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Global Business</label>
                  <select className={inputClasses} value={form.business} onChange={(e) => update("business", e.target.value)}>
                    <option value="">Select business...</option>
                    {BUSINESSES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Offering Portfolio</label>
                  <select className={inputClasses} value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)}>
                    <option value="">Select portfolio...</option>
                    {PORTFOLIOS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>GPS or Commercial</label>
                  <select className={inputClasses} value={form.gpsComm} onChange={(e) => update("gpsComm", e.target.value)}>
                    <option value="">Select...</option>
                    {GPS_COMM.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>FY25 Performance Rating</label>
                  <select className={inputClasses} value={form.rating} onChange={(e) => update("rating", e.target.value)}>
                    <option value="">Select rating...</option>
                    {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Compensation
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>FY25 Current Base Salary (USD) *</label>
                  <input className={inputClasses} type="number" placeholder="e.g. 136000"
                    value={form.salary} onChange={(e) => update("salary", e.target.value)} />
                  <div className="text-[10px] text-stone-300 mt-1 ml-1">Your current / last known salary</div>
                </div>

                <div>
                  <label className={labelClasses}>
                    FY26 New Base Salary (USD) <span className="text-stone-300 font-normal normal-case tracking-normal">— optional</span>
                  </label>
                  <input className={inputClasses} type="number" placeholder="e.g. 145000"
                    value={form.newSalary} onChange={(e) => update("newSalary", e.target.value)} />
                  <div className="text-[10px] text-stone-300 mt-1 ml-1">Leave blank if not yet received</div>
                </div>

                <div>
                  <label className={labelClasses}>
                    AIP / Bonus (USD) <span className="text-stone-300 font-normal normal-case tracking-normal">— optional</span>
                  </label>
                  <input className={inputClasses} type="number" placeholder="e.g. 14000"
                    value={form.aip} onChange={(e) => update("aip", e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className={labelClasses}>Total Yrs</label>
                    <input className={inputClasses} type="number" placeholder="6"
                      value={form.totalYears} onChange={(e) => update("totalYears", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>@ Deloitte</label>
                    <input className={inputClasses} type="number" placeholder="4"
                      value={form.yearsDeloitte} onChange={(e) => update("yearsDeloitte", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>@ Level</label>
                    <input className={inputClasses} type="number" placeholder="2"
                      value={form.yearsLevel} onChange={(e) => update("yearsLevel", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-fade-up-2 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              disabled={!canSubmit}
              onClick={() => setStep(2)}
              className="w-full sm:w-auto bg-stone-900 text-white px-10 py-4 rounded-2xl text-[15px] font-semibold cursor-pointer transition-all hover:bg-stone-800 hover:-translate-y-0.5 disabled:opacity-20 disabled:cursor-not-allowed disabled:translate-y-0 shadow-xl shadow-stone-900/10 active:scale-[0.98]"
            >
              See My Results &rarr;
            </button>
            {!canSubmit && (
              <span className="text-[12px] text-stone-300">Level and base salary are required</span>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── RESULTS ───
  return (
    <div className="min-h-screen font-sans relative">
      <div className="mesh-gradient animate-mesh-move fixed inset-0 -z-10" />
      <div className="fixed inset-0 bg-[#faf9f7]/60 -z-[5]" />
      <div className="grain-overlay" />

      {/* Nav */}
      <nav className="relative z-10 max-w-[1000px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
        >
          <span>&larr;</span> Edit inputs
        </button>
        <button
          onClick={() => setStep(0)}
          className="text-[12px] text-stone-300 hover:text-stone-500 transition-colors cursor-pointer font-medium"
        >
          Start over
        </button>
      </nav>

      {analysis && (
        <main className="relative z-10 max-w-[1000px] mx-auto px-6 pb-16">
          {/* Results header */}
          <div className="mb-8 opacity-0 animate-fade-up">
            <div className="text-[10px] text-stone-400 uppercase tracking-[0.12em] font-semibold mb-3">Your Compensation Analysis</div>
            <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight mb-3">
              {analysis.pct}<span className="text-3xl align-top">th</span>
              <span className="text-stone-300 font-sans text-2xl font-normal ml-3">percentile</span>
            </h1>
            <p className="text-stone-400 text-sm">
              {form.level} &middot; {form.business || "All Businesses"} &middot; n={analysis.stats.count} peers
            </p>
          </div>

          {/* Insights */}
          <div className="mb-6 opacity-0 animate-fade-up-1">
            {analysis.insights.map((ins, i) => (
              <InsightChip key={i} text={ins.text} type={ins.type} />
            ))}
          </div>

          {/* Stat cards */}
          <div className="opacity-0 animate-fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              label={analysis.newSal ? "FY26 Base" : "FY25 Base"}
              value={fmt(analysis.sal)}
              sub={`${analysis.pct}th percentile${!analysis.newSal ? " (FY25)" : ""}`}
              accent="#8b5cf6"
            />
            <StatCard
              label="Median Base"
              value={fmt(analysis.stats.salary.p50)}
              sub={`${analysis.vsMedian >= 0 ? "+" : ""}${fmt(analysis.vsMedian)} vs yours`}
              accent={analysis.vsMedian >= 0 ? "#10b981" : "#ef4444"}
            />
            <StatCard
              label="Your AIP"
              value={form.aip ? fmt(analysis.aip) : "—"}
              sub={`Median: ${fmt(analysis.stats.aip.p50)}`}
              accent="#f59e0b"
            />
            <StatCard
              label="Total Comp"
              value={fmt(analysis.tc)}
              sub={`Median: ${fmt(analysis.stats.tc.p50)}`}
              accent="#06b6d4"
            />
          </div>

          {!analysis.newSal && (
            <div className="opacity-0 animate-fade-up-2 mb-6 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-[12px] text-amber-700 flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>
                Benchmarking against your <strong>FY25 base</strong>. Add your FY26 salary once received for raise analysis.
              </span>
            </div>
          )}

          {/* Chart + Percentile */}
          <div className="opacity-0 animate-fade-up-3 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-5">
                Salary Distribution — Your Level
              </div>
              <BenchmarkChart userSalary={analysis.sal} level={form.level} levelStats={analysis.stats} />
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-5">
                Percentile Position
              </div>
              <div className="text-center mb-5">
                <div className="text-6xl font-bold font-mono text-stone-900 tracking-tighter leading-none">
                  {analysis.pct}<span className="text-2xl text-stone-300 align-top ml-0.5">th</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-2">base salary percentile</div>
              </div>
              <PercentileBar percentile={analysis.pct} />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[["P25", analysis.stats.salary.p25], ["Median", analysis.stats.salary.p50],
                  ["P75", analysis.stats.salary.p75], ["P90", analysis.stats.salary.p90]].map(([label, val]) => (
                  <div key={label} className="bg-stone-50 rounded-xl px-3 py-2.5">
                    <div className="text-[10px] text-stone-400 font-medium">{label}</div>
                    <div className="text-[14px] font-semibold font-mono text-stone-700">{fmt(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Raise + range */}
          <div className="opacity-0 animate-fade-up-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {analysis.raiseRate !== null ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-4">Year-Over-Year Raise</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-4xl font-bold font-mono tracking-tight ${analysis.raiseRate >= 0.06 ? "text-emerald-600" : "text-amber-600"}`}>
                    +{fmtPct(analysis.raiseRate)}
                  </span>
                  <span className="text-stone-300 text-sm font-medium">raise</span>
                </div>
                <div className="bg-stone-50 rounded-xl p-3.5">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wide font-semibold mb-2">Survey context</div>
                  {[["P25 raise", "~4.4%"], ["Median raise", "~7.0%"], ["P75 raise", "~10.9%"]].map(([l, v]) => (
                    <div key={l} className="flex justify-between text-[13px] text-stone-500 mb-1 last:mb-0">
                      <span>{l}</span>
                      <span className="font-mono font-medium text-stone-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border border-dashed border-stone-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center min-h-[180px]">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3 text-lg">?</div>
                <div className="text-sm font-semibold text-stone-400 mb-1">Raise analysis pending</div>
                <div className="text-xs text-stone-300 leading-relaxed max-w-[240px]">
                  Add your FY26 salary to see your raise vs. peers. Survey median is <span className="font-mono font-semibold text-stone-500">~7.0%</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-4">Full Salary Range</div>
              <div className="relative h-2 bg-stone-100 rounded-full my-6">
                <div
                  className="absolute h-full bg-gradient-to-r from-violet-300 to-violet-500 rounded-full"
                  style={{
                    left: `${((analysis.stats.salary.p25 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                    right: `${100 - ((analysis.stats.salary.p75 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                  }}
                />
                <div
                  className="absolute w-4 h-4 bg-emerald-500 rounded-full top-1/2 -mt-2 border-2 border-white shadow-md shadow-emerald-200"
                  style={{
                    left: `${Math.min(100, Math.max(0, ((analysis.sal - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100))}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mb-4">
                <span>{fmt(analysis.stats.salary.p10)}</span>
                <span>{fmt(analysis.stats.salary.p90)}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-stone-400 mb-3">
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-violet-400 mr-1 align-middle" /> P25–P75</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1 align-middle" /> You</span>
              </div>
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="text-[12px] text-stone-500">
                  Gap to P75:{" "}
                  <span className={`font-mono font-semibold ${analysis.sal >= analysis.stats.salary.p75 ? "text-emerald-600" : "text-amber-600"}`}>
                    {analysis.sal >= analysis.stats.salary.p75 ? "Above P75" : fmt(analysis.stats.salary.p75 - analysis.sal)}
                  </span>
                </div>
                {analysis.sal < analysis.stats.salary.p75 && (
                  <div className="text-[11px] text-stone-400 mt-1">
                    Gap to P90: <span className="font-mono">{fmt(analysis.stats.salary.p90 - analysis.sal)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AIP comparison */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm mb-4">
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-4">
              AIP Benchmarks — {form.level}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["Your AIP", form.aip ? fmt(analysis.aip) : "—", form.aip && analysis.aip >= analysis.stats.aip.p50 ? "text-emerald-600" : "text-stone-400"],
                ["P25 AIP", fmt(analysis.stats.aip.p25), "text-stone-500"],
                ["Median AIP", fmt(analysis.stats.aip.p50), "text-violet-600"],
                ["P75 AIP", fmt(analysis.stats.aip.p75), "text-stone-500"],
              ].map(([label, val, colorClass]) => (
                <div key={label} className="text-center p-4 bg-stone-50 rounded-xl">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-2 font-semibold">{label}</div>
                  <div className={`text-xl font-bold font-mono ${colorClass}`}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnote */}
          <div className="p-4 border-t border-stone-100 mt-8 space-y-2">
            <p className="text-[11px] text-stone-300 leading-relaxed">
              <strong className="text-stone-400">Source:</strong> Crowdsourced from the 2025 Deloitte compensation survey on Fishbowl &middot; {totalRespondents.toLocaleString()} US respondents &middot; Not affiliated with Deloitte
            </p>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              <strong className="text-stone-400">Privacy:</strong> No data is collected, stored, or transmitted. All analysis runs entirely in your browser.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
