import { useState, useMemo } from "react";
import PercentileBar from "./PercentileBar";
import StatCard from "./StatCard";
import InsightChip from "./InsightChip";
import BenchmarkChart from "./BenchmarkChart";
import {
  LEVEL_STATS, LEVELS, BUSINESSES, PORTFOLIOS, GPS_COMM, CLIENT_RATINGS,
  BUSINESS_MODELS, CONSOLIDATED_RATINGS, EDUCATION_LEVELS,
  GPS_COMMERCIAL_STATS, USDC_STATS, CONSOLIDATED_RATING_RAISES,
  CLIENT_RATING_RAISES, MBA_PREMIUM, PROMOTION_RAISES,
  totalRespondents,
} from "../data/salaryData";

export const fmt = (n) => {
  if (n == null) return "N/A";
  const abs = Math.abs(Math.round(n));
  const formatted = `$${abs.toLocaleString()}`;
  return n < 0 ? `-${formatted}` : formatted;
};

const fmtPct = (n) => (n != null ? `${(n * 100).toFixed(1)}%` : "N/A");

function getPercentile(value, salaryStats) {
  const s = salaryStats;
  if (!s || !value) return null;
  if (value <= s.p10) return 10;
  if (value <= s.p25) return Math.round(10 + 15 * (value - s.p10) / (s.p25 - s.p10));
  if (value <= s.p50) return Math.round(25 + 25 * (value - s.p25) / (s.p50 - s.p25));
  if (value <= s.p75) return Math.round(50 + 25 * (value - s.p50) / (s.p75 - s.p50));
  if (value <= s.p90) return Math.round(75 + 15 * (value - s.p75) / (s.p90 - s.p75));
  return Math.min(99, 90 + Math.round(10 * (value - s.p90) / (s.p90 - s.p75)));
}

const inputClasses = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-900 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 transition-all placeholder:text-stone-300 font-sans";
const labelClasses = "text-[10px] text-stone-400 uppercase tracking-[0.12em] mb-1.5 block font-semibold";

export default function DeloitteSalaryAnalyzer() {
  const [step, setStep] = useState(0); // 0=hero, 1=form, 2=results
  const [form, setForm] = useState({
    level: "",
    fy25Salary: "",
    fy25Aip: "",
    fy26Salary: "",
    fy26Aip: "",
    business: "",
    businessModel: "",
    portfolio: "",
    gpsComm: "",
    yearsDeloitte: "",
    yearsLevel: "",
    totalYears: "",
    clientRating: "",
    consolidatedRating: "",
    education: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateBusiness = (v) => {
    setForm((f) => ({ ...f, business: v, businessModel: v === "Consulting Services" ? f.businessModel : "" }));
  };

  const analysis = useMemo(() => {
    if (!form.level || !form.fy25Salary) return null;
    const fy25Sal = parseFloat(form.fy25Salary);
    if (!Number.isFinite(fy25Sal) || fy25Sal <= 0) return null;

    const rawFy25Aip = parseFloat(form.fy25Aip);
    const fy25Aip = Number.isFinite(rawFy25Aip) && rawFy25Aip >= 0 ? rawFy25Aip : 0;
    const fy25Tc = fy25Sal + fy25Aip;

    const rawFy26Sal = parseFloat(form.fy26Salary);
    const fy26Sal = Number.isFinite(rawFy26Sal) && rawFy26Sal > 0 ? rawFy26Sal : null;
    const rawFy26Aip = parseFloat(form.fy26Aip);
    const fy26Aip = Number.isFinite(rawFy26Aip) && rawFy26Aip >= 0 ? rawFy26Aip : null;
    const fy26Tc = fy26Sal ? fy26Sal + (fy26Aip || 0) : null;

    const raiseRate = fy26Sal && fy25Sal > 0 ? (fy26Sal - fy25Sal) / fy25Sal : null;

    // Pick stats: GPS/Commercial filtered if selected, else blended
    const blendedStats = LEVEL_STATS[form.level];
    if (!blendedStats) return null;

    const gpsCommSplit = GPS_COMMERCIAL_STATS[form.level];
    const hasFilteredStats = form.gpsComm && gpsCommSplit?.[form.gpsComm];
    const stats = hasFilteredStats ? gpsCommSplit[form.gpsComm] : blendedStats;
    const peerLabel = hasFilteredStats ? `${form.gpsComm} peers` : "all peers";

    // USDC context (not primary benchmark)
    const usdcData = form.businessModel === "USDC" ? USDC_STATS[form.level] : null;

    // Primary benchmark is FY25 salary vs FY25 survey data
    const pct = getPercentile(fy25Sal, stats.salary);
    const vsMedian = fy25Sal - stats.salary.p50;
    const vsMedianPct = vsMedian / stats.salary.p50;

    // GPS/Commercial delta
    const gpsCommDelta = gpsCommSplit
      ? gpsCommSplit.Commercial.salary.p50 - gpsCommSplit.GPS.salary.p50
      : null;

    // ─── Insights ───
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

    if (fy25Aip > 0) {
      const aipVsMedian = fy25Aip - stats.aip.p50;
      if (aipVsMedian > 0) insights.push({ text: `FY25 AIP ${fmt(fy25Aip)} — +${fmt(aipVsMedian)} above median`, type: "good" });
      else insights.push({ text: `FY25 AIP ${fmt(fy25Aip)} — ${fmt(aipVsMedian)} vs median`, type: "warn" });
    }

    // MBA premium insight
    const mbaPremium = form.education === "MBA" ? MBA_PREMIUM[form.level] : null;
    if (mbaPremium) {
      insights.push({
        text: `MBA premium at your level: +${fmt(mbaPremium.delta)} (+${(mbaPremium.deltaPct * 100).toFixed(0)}%)`,
        type: mbaPremium.deltaPct >= 0.05 ? "good" : "neutral",
      });
    }

    // Rating-based raise data
    const consolidatedRaiseData = form.consolidatedRating
      ? CONSOLIDATED_RATING_RAISES[form.consolidatedRating]
      : null;
    const clientRaiseData = form.clientRating
      ? CLIENT_RATING_RAISES[form.clientRating]
      : null;
    const ratingRaiseData = consolidatedRaiseData || clientRaiseData;
    const ratingLabel = consolidatedRaiseData ? form.consolidatedRating : form.clientRating;

    // Projected FY26 if no actual FY26 provided but we have rating data
    let projectedFy26 = null;
    if (!fy26Sal && ratingRaiseData) {
      projectedFy26 = {
        low: Math.round(fy25Sal * (1 + ratingRaiseData.p25)),
        mid: Math.round(fy25Sal * (1 + ratingRaiseData.median)),
        high: Math.round(fy25Sal * (1 + ratingRaiseData.p75)),
      };
    }

    // Promotion context
    const promoData = PROMOTION_RAISES[form.level] || null;

    return {
      fy25Sal, fy25Aip, fy25Tc,
      fy26Sal, fy26Aip, fy26Tc,
      raiseRate,
      stats, blendedStats,
      pct, vsMedian, vsMedianPct,
      gpsCommDelta,
      peerLabel,
      hasFilteredStats,
      usdcData,
      mbaPremium,
      ratingRaiseData, ratingLabel,
      consolidatedRaiseData, clientRaiseData,
      projectedFy26,
      promoData,
      insights,
    };
  }, [form]);

  const parsedSalary = parseFloat(form.fy25Salary);
  const canSubmit = form.level && form.fy25Salary && Number.isFinite(parsedSalary) && parsedSalary > 0;

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
                  <select className={inputClasses} value={form.business} onChange={(e) => updateBusiness(e.target.value)}>
                    <option value="">Select business...</option>
                    {BUSINESSES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {form.business === "Consulting Services" && (
                  <div>
                    <label className={labelClasses}>Business Model</label>
                    <select className={inputClasses} value={form.businessModel}
                      onChange={(e) => update("businessModel", e.target.value)}>
                      <option value="">Select...</option>
                      {BUSINESS_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}

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
                  <label className={labelClasses}>FY25 Client Rating</label>
                  <select className={inputClasses} value={form.clientRating} onChange={(e) => update("clientRating", e.target.value)}>
                    <option value="">Select rating...</option>
                    {CLIENT_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>
                    Consolidated Rating <span className="text-stone-300 font-normal normal-case tracking-normal">— e.g. EEE, ESS</span>
                  </label>
                  <select className={inputClasses} value={form.consolidatedRating}
                    onChange={(e) => update("consolidatedRating", e.target.value)}>
                    <option value="">Select...</option>
                    {CONSOLIDATED_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Education Level</label>
                  <select className={inputClasses} value={form.education}
                    onChange={(e) => update("education", e.target.value)}>
                    <option value="">Select...</option>
                    {EDUCATION_LEVELS.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                FY25 Compensation
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className={labelClasses}>Base Salary (USD) *</label>
                  <input className={inputClasses} type="number" placeholder="e.g. 136000"
                    value={form.fy25Salary} onChange={(e) => update("fy25Salary", e.target.value)} />
                </div>
                <div>
                  <label className={labelClasses}>
                    AIP / Bonus (USD) <span className="text-stone-300 font-normal normal-case tracking-normal">— optional</span>
                  </label>
                  <input className={inputClasses} type="number" placeholder="e.g. 14000"
                    value={form.fy25Aip} onChange={(e) => update("fy25Aip", e.target.value)} />
                </div>
              </div>

              <div className="border-t border-stone-100 mb-6" />

              <div className="text-[10px] font-semibold text-violet-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                FY26 Compensation <span className="text-stone-300 font-normal normal-case tracking-normal">— optional</span>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className={labelClasses}>Base Salary (USD)</label>
                  <input className={inputClasses} type="number" placeholder="e.g. 145000"
                    value={form.fy26Salary} onChange={(e) => update("fy26Salary", e.target.value)} />
                  <div className="text-[10px] text-stone-300 mt-1 ml-1">Leave blank if not yet received</div>
                </div>
                <div>
                  <label className={labelClasses}>AIP / Bonus (USD)</label>
                  <input className={inputClasses} type="number" placeholder="e.g. 16000"
                    value={form.fy26Aip} onChange={(e) => update("fy26Aip", e.target.value)} />
                </div>
              </div>

              <div className="border-t border-stone-100 mb-6" />

              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                Experience
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
              {form.level} &middot; {form.gpsComm || "All"} &middot; n={analysis.stats.count} {analysis.peerLabel}
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
              label="FY25 Base"
              value={fmt(analysis.fy25Sal)}
              sub={`${analysis.pct}th percentile`}
              accent="#8b5cf6"
            />
            <StatCard
              label={`Median Base${analysis.hasFilteredStats ? ` (${form.gpsComm})` : ""}`}
              value={fmt(analysis.stats.salary.p50)}
              sub={`${analysis.vsMedian >= 0 ? "+" : ""}${fmt(analysis.vsMedian)} vs yours`}
              accent={analysis.vsMedian >= 0 ? "#10b981" : "#ef4444"}
            />
            <StatCard
              label="FY25 AIP"
              value={analysis.fy25Aip > 0 ? fmt(analysis.fy25Aip) : "—"}
              sub={`Median: ${fmt(analysis.stats.aip.p50)}`}
              accent="#f59e0b"
            />
            <StatCard
              label="FY25 Total Comp"
              value={fmt(analysis.fy25Tc)}
              sub={`Median: ${fmt(analysis.stats.tc.p50)}`}
              accent="#06b6d4"
            />
          </div>

          {!analysis.fy26Sal && (
            <div className="opacity-0 animate-fade-up-2 mb-6 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-[12px] text-amber-700 flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>
                Benchmarking against your <strong>FY25 comp</strong>.
                {analysis.projectedFy26
                  ? <> Based on your rating, projected FY26 base: <strong className="font-mono">{fmt(analysis.projectedFy26.mid)}</strong> (range {fmt(analysis.projectedFy26.low)}–{fmt(analysis.projectedFy26.high)})</>
                  : <> Add your FY26 salary once received for raise analysis.</>
                }
              </span>
            </div>
          )}

          {/* Chart + Percentile */}
          <div className="opacity-0 animate-fade-up-3 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.1em] mb-5">
                Salary Distribution — Your Level
              </div>
              <BenchmarkChart userSalary={analysis.fy25Sal} level={form.level} levelStats={analysis.stats} />
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
                <div className="text-sm font-semibold text-stone-400 mb-1">Raise analysis</div>
                <div className="text-xs text-stone-300 leading-relaxed max-w-[240px]">
                  {analysis.projectedFy26
                    ? <>With a {analysis.ratingLabel} rating, expected raise is <span className="font-mono font-semibold text-stone-500">~{(analysis.ratingRaiseData.median * 100).toFixed(1)}%</span>. Projected FY26: <span className="font-mono font-semibold text-stone-500">{fmt(analysis.projectedFy26.mid)}</span></>
                    : <>Add your FY26 salary to see your raise vs. peers. Survey median is <span className="font-mono font-semibold text-stone-500">~7.0%</span></>
                  }
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
                    left: `${Math.min(100, Math.max(0, ((analysis.fy25Sal - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100))}%`,
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
                  <span className={`font-mono font-semibold ${analysis.fy25Sal >= analysis.stats.salary.p75 ? "text-emerald-600" : "text-amber-600"}`}>
                    {analysis.fy25Sal >= analysis.stats.salary.p75 ? "Above P75" : fmt(analysis.stats.salary.p75 - analysis.fy25Sal)}
                  </span>
                </div>
                {analysis.fy25Sal < analysis.stats.salary.p75 && (
                  <div className="text-[11px] text-stone-400 mt-1">
                    Gap to P90: <span className="font-mono">{fmt(analysis.stats.salary.p90 - analysis.fy25Sal)}</span>
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
                ["Your FY25 AIP", analysis.fy25Aip > 0 ? fmt(analysis.fy25Aip) : "—", analysis.fy25Aip > 0 && analysis.fy25Aip >= analysis.stats.aip.p50 ? "text-emerald-600" : "text-stone-400"],
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
