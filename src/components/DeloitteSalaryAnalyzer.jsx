import { useState, useMemo } from "react";
import AnimatedGradient from "./AnimatedGradient";
import PercentileBar from "./PercentileBar";
import StatCard from "./StatCard";
import InsightChip from "./InsightChip";
import BenchmarkChart from "./BenchmarkChart";

const SURVEY_DATA = [{"FY26 Level":"Senior Manager / Specialist Leader","FY26 Base Salary (USD)":270500.0,"AIP (USD)":25400.0,"Total Compensation (FY26, AIP, Other)":295900.0,"Compensation Change (%)":0.06706114398,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Cyber","Talent Model":"Core (Traditional)","Years at Deloitte":10.0,"Years at Level":5.0,"Total Professional Years of Experience":15.0,"Consolidated Rating":"SEE","Client Rating":"Strong","Gender":null},{"FY26 Level":"Senior Manager / Specialist Leader","FY26 Base Salary (USD)":220000.0,"AIP (USD)":60000.0,"Total Compensation (FY26, AIP, Other)":320000.0,"Compensation Change (%)":0.1,"FY26 Global Business":"Consulting Services","GPS or Commercial":"GPS","FY26 Offering Portfolio":"Cyber","Talent Model":"Core (Traditional)","Years at Deloitte":13.0,"Years at Level":5.0,"Total Professional Years of Experience":15.0,"Consolidated Rating":"EEE","Client Rating":"Exceptional","Gender":"Male"},{"FY26 Level":"Senior Consultant / Specialist Senior / Senior","FY26 Base Salary (USD)":138000.0,"AIP (USD)":11000.0,"Total Compensation (FY26, AIP, Other)":149000.0,"Compensation Change (%)":0.05748113208,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Strategy & Analytics","Talent Model":"Core (Traditional)","Years at Deloitte":4.0,"Years at Level":1.0,"Total Professional Years of Experience":4.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Male"},{"FY26 Level":"Consultant / Staff","FY26 Base Salary (USD)":108000.0,"AIP (USD)":8000.0,"Total Compensation (FY26, AIP, Other)":116000.0,"Compensation Change (%)":0.07142857143,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Strategy & Analytics","Talent Model":"Core (Traditional)","Years at Deloitte":2.5,"Years at Level":2.5,"Total Professional Years of Experience":2.5,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Male"},{"FY26 Level":"Manager / Specialist Master","FY26 Base Salary (USD)":190000.0,"AIP (USD)":27500.0,"Total Compensation (FY26, AIP, Other)":217500.0,"Compensation Change (%)":0.08045977011,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Strategy & Analytics","Talent Model":"Core (Traditional)","Years at Deloitte":7.0,"Years at Level":2.0,"Total Professional Years of Experience":10.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Female"},{"FY26 Level":"Senior Consultant / Specialist Senior / Senior","FY26 Base Salary (USD)":140000.0,"AIP (USD)":14000.0,"Total Compensation (FY26, AIP, Other)":154000.0,"Compensation Change (%)":0.07142857143,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Human Capital","Talent Model":"Core (Traditional)","Years at Deloitte":3.5,"Years at Level":1.5,"Total Professional Years of Experience":5.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Female"},{"FY26 Level":"Manager / Specialist Master","FY26 Base Salary (USD)":185000.0,"AIP (USD)":24000.0,"Total Compensation (FY26, AIP, Other)":209000.0,"Compensation Change (%)":0.07407407407,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Core Business Operations","Talent Model":"Core (Traditional)","Years at Deloitte":6.0,"Years at Level":2.0,"Total Professional Years of Experience":8.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Male"},{"FY26 Level":"Senior Consultant / Specialist Senior / Senior","FY26 Base Salary (USD)":130000.0,"AIP (USD)":12000.0,"Total Compensation (FY26, AIP, Other)":142000.0,"Compensation Change (%)":0.07438016529,"FY26 Global Business":"Consulting Services","GPS or Commercial":"GPS","FY26 Offering Portfolio":"Core Business Operations","Talent Model":"Core (Traditional)","Years at Deloitte":3.0,"Years at Level":1.0,"Total Professional Years of Experience":5.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Male"},{"FY26 Level":"Analyst / Jr Staff","FY26 Base Salary (USD)":88000.0,"AIP (USD)":null,"Total Compensation (FY26, AIP, Other)":88500.0,"Compensation Change (%)":0.09163346614,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Strategy & Analytics","Talent Model":"Core (Traditional)","Years at Deloitte":1.0,"Years at Level":1.0,"Total Professional Years of Experience":1.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Female"},{"FY26 Level":"Manager / Specialist Master","FY26 Base Salary (USD)":200000.0,"AIP (USD)":30000.0,"Total Compensation (FY26, AIP, Other)":230000.0,"Compensation Change (%)":0.08108108108,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Customer","Talent Model":"Core (Traditional)","Years at Deloitte":8.0,"Years at Level":3.0,"Total Professional Years of Experience":10.0,"Consolidated Rating":"EE","Client Rating":"Exceptional","Gender":"Male"},{"FY26 Level":"Senior Manager / Specialist Leader","FY26 Base Salary (USD)":245000.0,"AIP (USD)":45000.0,"Total Compensation (FY26, AIP, Other)":290000.0,"Compensation Change (%)":0.08888888889,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Strategy & Analytics","Talent Model":"Core (Traditional)","Years at Deloitte":12.0,"Years at Level":4.0,"Total Professional Years of Experience":16.0,"Consolidated Rating":"EE","Client Rating":"Exceptional","Gender":"Female"},{"FY26 Level":"Consultant / Staff","FY26 Base Salary (USD)":104000.0,"AIP (USD)":7500.0,"Total Compensation (FY26, AIP, Other)":111500.0,"Compensation Change (%)":0.06666666667,"FY26 Global Business":"Consulting Services","GPS or Commercial":"GPS","FY26 Offering Portfolio":"Core Business Operations","Talent Model":"Core (Traditional)","Years at Deloitte":2.0,"Years at Level":2.0,"Total Professional Years of Experience":4.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Female"},{"FY26 Level":"Senior Consultant / Specialist Senior / Senior","FY26 Base Salary (USD)":145000.0,"AIP (USD)":13500.0,"Total Compensation (FY26, AIP, Other)":158500.0,"Compensation Change (%)":0.06617647059,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Cyber & Strategic Risk","Talent Model":"Core (Traditional)","Years at Deloitte":5.0,"Years at Level":2.0,"Total Professional Years of Experience":7.0,"Consolidated Rating":"EE","Client Rating":"Exceptional","Gender":"Male"},{"FY26 Level":"Manager / Specialist Master","FY26 Base Salary (USD)":175000.0,"AIP (USD)":22000.0,"Total Compensation (FY26, AIP, Other)":197000.0,"Compensation Change (%)":0.07407407407,"FY26 Global Business":"Consulting Services","GPS or Commercial":"GPS","FY26 Offering Portfolio":"Core Business Operations","Talent Model":"Core (Traditional)","Years at Deloitte":5.0,"Years at Level":1.0,"Total Professional Years of Experience":7.0,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Female"},{"FY26 Level":"Analyst / Jr Staff","FY26 Base Salary (USD)":92000.0,"AIP (USD)":null,"Total Compensation (FY26, AIP, Other)":92500.0,"Compensation Change (%)":0.07692307692,"FY26 Global Business":"Consulting Services","GPS or Commercial":"Commercial","FY26 Offering Portfolio":"Human Capital","Talent Model":"Core (Traditional)","Years at Deloitte":1.5,"Years at Level":1.5,"Total Professional Years of Experience":1.5,"Consolidated Rating":"SS","Client Rating":"Strong","Gender":"Male"}];

const LEVEL_STATS = {
  "Analyst / Jr Staff": {
    count: 78,
    salary: { p10: 78160, p25: 87800, p50: 94000, p75: 99225, p90: 102500, mean: 92860 },
    aip: { p25: 4900, p50: 4900, p75: 4900, mean: 4900 },
    tc: { p25: 87950, p50: 94975, p75: 100475 },
  },
  "Consultant / Staff": {
    count: 390,
    salary: { p10: 93590, p25: 99700, p50: 106300, p75: 115400, p90: 121200, mean: 107589 },
    aip: { p25: 4800, p50: 7000, p75: 10200, mean: 7823 },
    tc: { p25: 104125, p50: 113750, p75: 125438 },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    count: 574,
    salary: { p10: 114260, p25: 121400, p50: 137000, p75: 151875, p90: 175970, mean: 138518 },
    aip: { p25: 8100, p50: 12000, p75: 15900, mean: 12593 },
    tc: { p25: 132925, p50: 150075, p75: 168388 },
  },
  "Manager / Specialist Master": {
    count: 511,
    salary: { p10: 148100, p25: 164250, p50: 187000, p75: 204000, p90: 215500, mean: 183242 },
    aip: { p25: 16300, p50: 24100, p75: 33600, mean: 26193 },
    tc: { p25: 185500, p50: 212000, p75: 237000 },
  },
  "Senior Manager / Specialist Leader": {
    count: 196,
    salary: { p10: 193000, p25: 218150, p50: 234500, p75: 255250, p90: 272000, mean: 233919 },
    aip: { p25: 29925, p50: 45000, p75: 53925, mean: 44179 },
    tc: { p25: 252000, p50: 281925, p75: 310302 },
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

// Soft pastel colors for light theme gradient
const GRADIENT_COLORS = ["#c7d2fe", "#e9d5ff", "#fbcfe8", "#bae6fd", "#ddd6fe"];

const inputClasses = "w-full bg-white/70 border border-black/[0.08] rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300";
const labelClasses = "text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 block font-medium";

export default function DeloitteSalaryAnalyzer() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    level: "", salary: "", newSalary: "", aip: "",
    business: "", portfolio: "", gpsComm: "",
    yearsDeloitte: "", yearsLevel: "", totalYears: "", rating: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const analysis = useMemo(() => {
    if (!form.level || !form.salary) return null;
    const currentSal = parseFloat(form.salary);
    const newSal = parseFloat(form.newSalary) || null;
    const benchmarkSal = newSal || currentSal;
    const aip = parseFloat(form.aip) || 0;
    const tc = benchmarkSal + aip;
    const raiseRate = newSal ? (newSal - currentSal) / currentSal : null;
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
      if (aipVsMedian > 0) insights.push({ text: `AIP ${fmt(aip)} — +${fmt(aipVsMedian)} above median bonus`, type: "good" });
      else insights.push({ text: `AIP ${fmt(aip)} — ${fmt(aipVsMedian)} vs median bonus`, type: "warn" });
    }

    return { sal, aip, tc, pct, stats, vsMedian, vsMedianPct, raiseRate, insights, newSal, currentSal };
  }, [form]);

  const canSubmit = form.level && form.salary;
  const totalRespondents = Object.values(LEVEL_STATS).reduce((s, v) => s + v.count, 0);

  return (
    <div className="relative min-h-screen font-sans text-slate-900">
      <AnimatedGradient colors={GRADIENT_COLORS} speed={5} blur="heavy" />
      {/* Soft white wash over gradient for readability */}
      <div className="fixed inset-0 bg-white/40 -z-[5]" />

      {/* Header */}
      <header className="relative z-10 border-b border-black/[0.04] backdrop-blur-xl bg-white/50">
        <div className="max-w-[920px] mx-auto px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-md shadow-indigo-200">
            D
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-slate-900">Deloitte Salary Analyzer</div>
            <div className="text-xs text-slate-400">
              2025 Open-Source Survey &bull; {totalRespondents.toLocaleString()} US respondents
            </div>
          </div>
          {step === 1 && (
            <button
              onClick={() => setStep(0)}
              className="ml-auto shrink-0 bg-white/70 border border-black/[0.06] text-slate-500 px-4 py-2 rounded-xl text-sm hover:bg-white hover:text-slate-700 transition-all cursor-pointer shadow-sm"
            >
              &larr; Edit Info
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-[920px] mx-auto px-5 py-8">
        {step === 0 && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                How does your comp stack up?
              </h1>
              <p className="text-slate-400 text-[15px]">
                Enter your FY26 compensation details to see where you fall among your peers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left card */}
              <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-6 shadow-sm">
                <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-5">
                  Your Level & Role
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>FY26 Level *</label>
                  <select className={inputClasses} value={form.level} onChange={(e) => update("level", e.target.value)}>
                    <option value="">Select level...</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>Global Business</label>
                  <select className={inputClasses} value={form.business} onChange={(e) => update("business", e.target.value)}>
                    <option value="">Select business...</option>
                    {BUSINESSES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>Offering Portfolio</label>
                  <select className={inputClasses} value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)}>
                    <option value="">Select portfolio...</option>
                    {PORTFOLIOS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="mb-4">
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

              {/* Right card */}
              <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-6 shadow-sm">
                <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-5">
                  Your Compensation
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>FY25 Current Base Salary (USD) *</label>
                  <input className={inputClasses} type="number" placeholder="e.g. 136000"
                    value={form.salary} onChange={(e) => update("salary", e.target.value)} />
                  <div className="text-[11px] text-slate-300 mt-1">Your current / last known salary</div>
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>
                    FY26 New Base Salary (USD) <span className="text-slate-300 font-normal">— optional</span>
                  </label>
                  <input className={inputClasses} type="number" placeholder="e.g. 145000"
                    value={form.newSalary} onChange={(e) => update("newSalary", e.target.value)} />
                  <div className="text-[11px] text-slate-300 mt-1">Leave blank if you haven't received it yet</div>
                </div>

                <div className="mb-4">
                  <label className={labelClasses}>
                    AIP / Bonus (USD) <span className="text-slate-300 font-normal">— optional</span>
                  </label>
                  <input className={inputClasses} type="number" placeholder="e.g. 14000"
                    value={form.aip} onChange={(e) => update("aip", e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className={labelClasses}>Total Yrs Exp</label>
                    <input className={inputClasses} type="number" placeholder="e.g. 6"
                      value={form.totalYears} onChange={(e) => update("totalYears", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>Yrs @ Deloitte</label>
                    <input className={inputClasses} type="number" placeholder="e.g. 4"
                      value={form.yearsDeloitte} onChange={(e) => update("yearsDeloitte", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>Yrs @ Level</label>
                    <input className={inputClasses} type="number" placeholder="e.g. 2"
                      value={form.yearsLevel} onChange={(e) => update("yearsLevel", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                disabled={!canSubmit}
                onClick={() => setStep(1)}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[15px] font-semibold cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0 shadow-lg shadow-slate-900/10"
              >
                Analyze My Compensation &rarr;
              </button>
              {!canSubmit && (
                <div className="text-xs text-slate-300 mt-2.5">Level and salary required</div>
              )}
            </div>
          </div>
        )}

        {step === 1 && analysis && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
                Your Compensation Analysis
              </h2>
              <div className="text-slate-400 text-sm">
                {form.level} &bull; {form.business || "All Businesses"} &bull; n={analysis.stats.count} peers
              </div>
            </div>

            {/* Insights */}
            <div className="mb-6">
              {analysis.insights.map((ins, i) => (
                <InsightChip key={i} text={ins.text} type={ins.type} />
              ))}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatCard
                label={analysis.newSal ? "Your FY26 Base" : "Your FY25 Base"}
                value={fmt(analysis.sal)}
                sub={`${analysis.pct}th percentile${!analysis.newSal ? " (using FY25)" : ""}`}
                accent="#6366f1"
              />
              <StatCard
                label="Median Base"
                value={fmt(analysis.stats.salary.p50)}
                sub={`vs yours: ${analysis.vsMedian >= 0 ? "+" : ""}${fmt(analysis.vsMedian)}`}
                accent={analysis.vsMedian >= 0 ? "#10b981" : "#ef4444"}
              />
              <StatCard
                label="Your AIP"
                value={form.aip ? fmt(analysis.aip) : "—"}
                sub={`Median: ${fmt(analysis.stats.aip.p50)}`}
                accent="#8b5cf6"
              />
              <StatCard
                label="Your Total Comp"
                value={fmt(analysis.tc)}
                sub={`Median TC: ${fmt(analysis.stats.tc.p50)}`}
                accent="#06b6d4"
              />
            </div>

            {!analysis.newSal && (
              <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-700 flex items-center gap-2">
                <span>💡</span>
                <span>
                  Benchmarking against your <strong>FY25 base salary</strong>. Once you receive your FY26 offer, add it above to see your raise and updated percentile.
                </span>
              </div>
            )}

            {/* Chart + Percentile */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-5">
              <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 shadow-sm">
                <div className="text-[13px] font-semibold text-slate-400 mb-4">
                  Base Salary Distribution — Your Level
                </div>
                <BenchmarkChart userSalary={analysis.sal} level={form.level} levelStats={analysis.stats} />
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 shadow-sm">
                <div className="text-[13px] font-semibold text-slate-400 mb-4">
                  Your Percentile Position
                </div>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold font-mono bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    {analysis.pct}<span className="text-2xl">th</span>
                  </div>
                  <div className="text-slate-400 text-[13px] mt-1">percentile for base salary</div>
                </div>
                <PercentileBar percentile={analysis.pct} />
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[["P25", analysis.stats.salary.p25], ["P50 (Median)", analysis.stats.salary.p50],
                    ["P75", analysis.stats.salary.p75], ["P90", analysis.stats.salary.p90]].map(([label, val]) => (
                    <div key={label} className="bg-slate-50/80 rounded-lg px-3 py-2">
                      <div className="text-[11px] text-slate-400">{label}</div>
                      <div className="text-sm font-semibold font-mono text-slate-700">{fmt(val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raise + range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {analysis.raiseRate !== null ? (
                <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 shadow-sm">
                  <div className="text-[13px] font-semibold text-slate-400 mb-4">Year-Over-Year Raise</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={`text-4xl font-bold font-mono ${analysis.raiseRate >= 0.06 ? "text-emerald-500" : "text-amber-500"}`}>
                      +{fmtPct(analysis.raiseRate)}
                    </span>
                    <span className="text-slate-400 text-sm">raise</span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-2">Survey context (your level)</div>
                    {[["P25 raise", "~4.4%"], ["Median raise", "~7.0%"], ["P75 raise", "~10.9%"]].map(([l, v]) => (
                      <div key={l} className="flex justify-between text-[13px] text-slate-500 mb-1 last:mb-0">
                        <span>{l}</span>
                        <span className="font-mono font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/40 backdrop-blur-xl border border-dashed border-black/[0.08] rounded-2xl p-5 flex flex-col justify-center items-center text-center min-h-[160px]">
                  <div className="text-3xl mb-2">⏳</div>
                  <div className="text-sm font-semibold text-slate-400 mb-1">Raise analysis pending</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Add your FY26 salary above once you receive it to see your raise vs. peers.
                    <br />Survey median raise is <span className="text-amber-600 font-mono font-medium">~7.0%</span>
                  </div>
                </div>
              )}

              <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 shadow-sm">
                <div className="text-[13px] font-semibold text-slate-400 mb-4">Full Level Salary Range</div>
                <div className="relative h-2 bg-slate-100 rounded-full my-5">
                  <div
                    className="absolute h-full bg-gradient-to-r from-indigo-300 to-violet-400 rounded-full"
                    style={{
                      left: `${((analysis.stats.salary.p25 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                      right: `${100 - ((analysis.stats.salary.p75 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute w-4 h-4 bg-emerald-500 rounded-full top-1/2 -mt-2 border-2 border-white shadow-md"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((analysis.sal - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100))}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-4">
                  <span>{fmt(analysis.stats.salary.p10)}</span>
                  <span>{fmt(analysis.stats.salary.p90)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-indigo-400">■</span> P25–P75 band &nbsp;
                  <span className="text-emerald-500">●</span> Your salary
                </div>
                <div className="mt-3 p-3 bg-slate-50/80 rounded-xl text-xs">
                  <div className="text-slate-500">
                    Gap to P75:{" "}
                    <span className={`font-mono font-semibold ${analysis.sal >= analysis.stats.salary.p75 ? "text-emerald-500" : "text-amber-500"}`}>
                      {analysis.sal >= analysis.stats.salary.p75 ? "You're above P75!" : fmt(analysis.stats.salary.p75 - analysis.sal)}
                    </span>
                  </div>
                  {analysis.sal < analysis.stats.salary.p75 && (
                    <div className="text-slate-400 mt-1">
                      Gap to P90: <span className="font-mono">{fmt(analysis.stats.salary.p90 - analysis.sal)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AIP comparison */}
            <div className="bg-white/60 backdrop-blur-xl border border-black/[0.04] rounded-2xl p-5 mb-5 shadow-sm">
              <div className="text-[13px] font-semibold text-slate-400 mb-4">
                Bonus (AIP) Benchmarks — {form.level}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["Your AIP", form.aip ? fmt(analysis.aip) : "—", form.aip && analysis.aip >= analysis.stats.aip.p50 ? "#10b981" : "#94a3b8"],
                  ["P25 AIP", fmt(analysis.stats.aip.p25), "#94a3b8"],
                  ["Median AIP", fmt(analysis.stats.aip.p50), "#6366f1"],
                  ["P75 AIP", fmt(analysis.stats.aip.p75), "#94a3b8"],
                ].map(([label, val, color]) => (
                  <div key={label} className="text-center p-4 bg-slate-50/80 rounded-xl">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">{label}</div>
                    <div className="text-xl font-bold font-mono" style={{ color }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footnote */}
            <div className="p-4 bg-white/40 backdrop-blur-xl border border-black/[0.04] rounded-xl">
              <div className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-500">Data source:</strong> 2025 Deloitte open-source employee salary survey.
                US-only responses with data quality concerns filtered out (n={totalRespondents.toLocaleString()} records).
                Statistics reflect FY26 base salary, AIP, and total compensation across all business areas unless filtered.
                This tool is for informational purposes only.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
