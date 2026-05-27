import { useState, useMemo } from "react";
import PercentileBar from "./PercentileBar";
import StatCard from "./StatCard";
import InsightChip from "./InsightChip";
import BenchmarkChart from "./BenchmarkChart";
import {
  LEVEL_STATS, LEVELS, BUSINESSES, PORTFOLIOS, GPS_COMM,
  BUSINESS_MODELS, EDUCATION_LEVELS,
  GPS_COMMERCIAL_STATS, MBA_STATS, PORTFOLIO_STATS, BUSINESS_STATS, USDC_STATS,
  MBA_PREMIUM, PROMOTION_RAISES, NON_PROMOTION_RAISE, NEXT_LEVEL,
  YEARS_AT_LEVEL_MANAGER,
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

const inputClasses = "w-full bg-white border border-slate-200 rounded-sm px-4 py-3 text-slate-900 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all placeholder:text-slate-300 font-sans";
const labelClasses = "text-[10px] text-slate-400 uppercase tracking-[0.12em] mb-1.5 block font-semibold";

function UsdcContext({ usdcData, level }) {
  const [showCore, setShowCore] = useState(false);
  const usdc = usdcData.USDC;
  const core = usdcData.Core;
  const shortLevel = level.split("/")[0].trim();

  return (
    <div className="mb-6 bg-white rounded-md p-5 sm:p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-semibold text-brand-500 uppercase tracking-[0.12em] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          USDC Benchmarks — {shortLevel}
        </div>
        <span className="text-[11px] text-slate-300 font-mono">n={usdc.count} USDC peers</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[["P25", usdc.salary.p25], ["Median", usdc.salary.p50], ["P75", usdc.salary.p75]].map(([label, val]) => (
          <div key={label} className="text-center p-3 bg-slate-50 rounded-sm">
            <div className="text-[10px] text-slate-400 font-semibold mb-1">{label}</div>
            <div className="text-lg font-semibold font-mono text-slate-700">{fmt(val)}</div>
          </div>
        ))}
      </div>

      {usdc.count < 30 && (
        <div className="mb-3 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Small sample — treat with caution (n={usdc.count})
        </div>
      )}

      <button
        onClick={() => setShowCore(!showCore)}
        className="text-[12px] text-brand-500 hover:text-brand-700 font-medium cursor-pointer transition-colors"
      >
        {showCore ? "Hide" : "Compare to"} Core (Traditional) &middot; n={core.count}
      </button>

      {showCore && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[["P25", core.salary.p25], ["Median", core.salary.p50], ["P75", core.salary.p75]].map(([label, val]) => (
            <div key={label} className="text-center p-3 bg-brand-50/50 rounded-sm border border-brand-100/50">
              <div className="text-[10px] text-brand-400 font-semibold mb-1">Core {label}</div>
              <div className="text-lg font-semibold font-mono text-brand-700">{fmt(val)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompareToggle({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-400 uppercase tracking-[0.1em] font-semibold shrink-0">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer transition-all whitespace-nowrap ${
              value === opt.value
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DeloitteSalaryAnalyzer() {
  const [step, setStep] = useState(0); // 0=hero, 1=form, 2=results
  const [form, setForm] = useState({
    level: "",
    fy26Base: "",
    fy26Aip: "",
    fy27Base: "",
    fy27Aip: "",
    business: "",
    businessModel: "",
    portfolio: "",
    gpsComm: "",
    education: "",
    yearsAtLevel: "",
    promotedThisCycle: false,
  });

  // Compare toggle state (results page only, independent of form)
  const [compareGroup, setCompareGroup] = useState(""); // "", "GPS", "Commercial"
  const [compareEdu, setCompareEdu] = useState(""); // "", "MBA", "NonMBA"
  const [comparePortfolio, setComparePortfolio] = useState(""); // "" = All, or a portfolio name

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateBusiness = (v) => {
    setForm((f) => ({ ...f, business: v, businessModel: v === "Consulting Services" ? f.businessModel : "" }));
  };

  const analysis = useMemo(() => {
    if (!form.level || !form.fy27Base) return null;
    const fy27Base = parseFloat(form.fy27Base);
    if (!Number.isFinite(fy27Base) || fy27Base <= 0) return null;

    const rawFy27Aip = parseFloat(form.fy27Aip);
    const fy27Aip = Number.isFinite(rawFy27Aip) && rawFy27Aip >= 0 ? rawFy27Aip : 0;
    const fy27Tc = fy27Base + fy27Aip;

    const rawFy26Base = parseFloat(form.fy26Base);
    const fy26Base = Number.isFinite(rawFy26Base) && rawFy26Base > 0 ? rawFy26Base : null;

    const rawFy26Aip = parseFloat(form.fy26Aip);
    const fy26Aip = Number.isFinite(rawFy26Aip) && rawFy26Aip >= 0 ? rawFy26Aip : null;

    const actualRaisePct = fy26Base != null ? (fy27Base - fy26Base) / fy26Base : null;

    // Pick stats based on compare toggles (results page) or form (initial)
    const allLevelStats = LEVEL_STATS[form.level];
    if (!allLevelStats) return null;

    // Business type filter (base filter — narrows the peer group)
    const businessStatsForLevel = BUSINESS_STATS[form.level];
    const activeBusiness = form.business;
    const hasBusinessStats = !!(activeBusiness && businessStatsForLevel?.[activeBusiness]);
    const blendedStats = hasBusinessStats ? businessStatsForLevel[activeBusiness] : allLevelStats;

    // GPS/Commercial filter
    const gpsCommSplit = GPS_COMMERCIAL_STATS[form.level];
    const activeGroup = step === 2 ? compareGroup : form.gpsComm;
    const hasFilteredStats = !!(activeGroup && gpsCommSplit?.[activeGroup]);
    let stats = hasFilteredStats ? gpsCommSplit[activeGroup] : blendedStats;
    let peerLabel = hasFilteredStats
      ? `${activeGroup} peers`
      : hasBusinessStats
        ? `${activeBusiness} peers`
        : "all peers";

    // MBA/Education filter (overrides GPS/Commercial if active, since we don't have cross-cuts)
    const mbaStatsForLevel = MBA_STATS[form.level];
    const activeEdu = step === 2 ? compareEdu : "";
    if (activeEdu && mbaStatsForLevel?.[activeEdu]) {
      stats = mbaStatsForLevel[activeEdu];
      peerLabel = activeEdu === "MBA" ? "MBA peers" : "Non-MBA peers";
    }

    // Portfolio filter (overrides GPS/Commercial and MBA if active)
    const portfolioStatsForLevel = PORTFOLIO_STATS[form.level];
    const activePortfolio = step === 2 ? comparePortfolio : "";
    if (activePortfolio && portfolioStatsForLevel?.[activePortfolio]) {
      stats = portfolioStatsForLevel[activePortfolio];
      peerLabel = `${activePortfolio} peers`;
    }

    // USDC context (not primary benchmark)
    const usdcData = form.businessModel === "USDC" ? USDC_STATS[form.level] : null;

    // Primary benchmark is FY27 base vs FY26 survey data
    const pct = getPercentile(fy27Base, stats.salary);
    const vsMedian = fy27Base - stats.salary.p50;

    // GPS/Commercial delta
    const gpsCommDelta = (gpsCommSplit?.Commercial && gpsCommSplit?.GPS)
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

    if (fy27Aip > 0 && stats.aip?.p50 != null) {
      const aipVsMedian = fy27Aip - stats.aip.p50;
      if (aipVsMedian > 0) insights.push({ text: `AIP ${fmt(fy27Aip)} — +${fmt(aipVsMedian)} above median`, type: "good" });
      else insights.push({ text: `AIP ${fmt(fy27Aip)} — ${fmt(aipVsMedian)} vs median`, type: "warn" });
    }

    // MBA premium insight
    const mbaPremium = form.education === "MBA" ? MBA_PREMIUM[form.level] : null;
    if (mbaPremium) {
      insights.push({
        text: `MBA premium at your level: +${fmt(mbaPremium.delta)} (+${(mbaPremium.deltaPct * 100).toFixed(0)}%)`,
        type: mbaPremium.deltaPct >= 0.05 ? "good" : "neutral",
      });
    }

    // Promotion context — into your level + out to next level
    const promoInto = PROMOTION_RAISES[form.level] || null;
    const nextLevelKey = NEXT_LEVEL[form.level];
    const promoNext = nextLevelKey ? PROMOTION_RAISES[nextLevelKey] || null : null;

    // Raise verdict + prediction: route comparison to the right cohort
    const promotedThisCycle = !!form.promotedThisCycle;
    let raiseAnalysis = null;
    if (actualRaisePct != null) {
      const target = promotedThisCycle && promoInto
        ? { median: promoInto.median, n: promoInto.n, cohort: "promoted", label: `promotion to ${promoInto.toLabel}` }
        : { median: NON_PROMOTION_RAISE.median, n: NON_PROMOTION_RAISE.n, cohort: "same-level", label: `staying at ${form.level.split("/")[0].trim()}` };
      const predictedBase = fy26Base * (1 + target.median);
      const predictedDelta = fy27Base - predictedBase;
      const deltaPp = actualRaisePct - target.median;
      const band = target.median * 0.1; // ±10% of typical = "in line"
      const verdict = Math.abs(deltaPp) <= band ? "in line" : deltaPp > 0 ? "above" : "below";
      raiseAnalysis = {
        ...target,
        actualPct: actualRaisePct,
        predictedBase,
        predictedDelta,
        deltaPp,
        verdict,
      };
    }

    // Years-at-level context (Manager only)
    let yearsContext = null;
    if (form.level === "Manager / Specialist Master") {
      const parsedYears = parseInt(form.yearsAtLevel, 10);
      const userYear = Number.isFinite(parsedYears) && parsedYears >= 1 ? Math.min(parsedYears, 5) : null;
      yearsContext = { buckets: YEARS_AT_LEVEL_MANAGER, userYear };
    }

    if (raiseAnalysis) {
      const symbol = raiseAnalysis.predictedDelta >= 0 ? "+" : "-";
      const absAmt = Math.abs(Math.round(raiseAnalysis.predictedDelta)).toLocaleString();
      insights.unshift({
        text: `${raiseAnalysis.verdict === "above" ? "Beat" : raiseAnalysis.verdict === "below" ? "Below" : "Met"} prediction by ${symbol}$${absAmt}`,
        type: raiseAnalysis.verdict === "below" ? "warn" : "good",
      });
    }

    return {
      fy27Base, fy27Aip, fy27Tc,
      fy26Base, fy26Aip,
      actualRaisePct, raiseAnalysis, promotedThisCycle,
      stats,
      pct, vsMedian,
      gpsCommDelta,
      peerLabel,
      hasFilteredStats,
      usdcData,
      promoInto,
      promoNext,
      yearsContext,
      insights,
    };
  }, [form, step, compareGroup, compareEdu, comparePortfolio]);

  const parsedFy27 = parseFloat(form.fy27Base);
  const canSubmit = form.level && form.fy27Base && Number.isFinite(parsedFy27) && parsedFy27 > 0;

  // ─── HERO / LANDING ───
  if (step === 0) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        {/* CSS mesh gradient background */}

        {/* Nav */}
        <nav className="relative z-10 max-w-[1100px] mx-auto px-6 pt-8 flex items-center justify-between opacity-0 animate-fade-up">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-[13px] font-semibold text-slate-500 tracking-wide uppercase">Salary Analyzer</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[12px] text-slate-400 font-mono">FY26 Benchmark · {totalRespondents.toLocaleString()} respondents</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-24 sm:pt-32 pb-20">
          <div className="max-w-[720px]">
            <div className="opacity-0 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-4 py-1.5 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[11px] text-slate-500 font-medium font-mono tabular-nums">FY27 comp letter · benchmarked against {totalRespondents.toLocaleString()} FY26 responses</span>
              </div>
            </div>

            <h1 className="opacity-0 animate-fade-up-1 text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-slate-900 mb-6">
              Just got your FY27 comp letter?
              <br />
              <span className="text-brand-600">See where you stand.</span>
            </h1>

            <p className="opacity-0 animate-fade-up-2 text-base sm:text-lg text-slate-500 leading-relaxed max-w-[560px] mb-10">
              Enter your FY26 and FY27 compensation. See your new percentile against <span className="font-mono tabular-nums text-slate-700">{totalRespondents.toLocaleString()}</span> FY26 responses, and how your raise compares to what FY26 trends would have predicted for your cohort. All client-side — nothing leaves your browser.
            </p>

            <div className="opacity-0 animate-fade-up-3 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(1)}
                className="bg-slate-900 text-white px-8 py-4 rounded-md text-[15px] font-semibold cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Analyze My FY27 Comp
              </button>
              <a
                href="#how-it-works"
                className="text-slate-400 px-6 py-4 text-[15px] font-medium hover:text-slate-600 transition-colors text-center cursor-pointer"
              >
                How it works &darr;
              </a>
            </div>
          </div>

          {/* Floating stat preview cards */}
          <div className="opacity-0 animate-fade-up-4 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { level: "Analyst", key: "Analyst / Jr Staff" },
              { level: "Consultant", key: "Consultant / Staff" },
              { level: "Manager", key: "Manager / Specialist Master" },
              { level: "Sr. Manager", key: "Senior Manager / Specialist Leader" },
            ].map((card) => (
              <div key={card.level} className="relative bg-white border border-slate-200 rounded-md p-4 sm:p-5 hover:border-slate-300 transition-colors">
                <div className="absolute top-0 left-0 h-full w-[2px] bg-brand-500" />
                <div className="pl-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-[0.14em] font-semibold font-mono">{card.level}</div>
                  <div className="text-xl sm:text-2xl font-semibold font-mono tabular-nums text-slate-900 mt-1 tracking-tight">{fmt(LEVEL_STATS[card.key].salary.p50)}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">n={LEVEL_STATS[card.key].count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section */}
        <div id="how-it-works" className="relative z-10 border-t border-slate-200">
          <div className="max-w-[1100px] mx-auto px-6 py-20">
            <h2 className="text-3xl sm:text-4xl text-slate-900 mb-12 tracking-tight">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "Enter both years",
                  desc: "Your level, plus FY26 and FY27 base and AIP. Only level and FY27 base are required — everything runs entirely in your browser.",
                },
                {
                  num: "02",
                  title: "Get benchmarked",
                  desc: "See your new FY27 percentile AND your predicted-vs-actual raise — how your FY26→FY27 bump compares to what FY26 trends would have predicted.",
                },
                {
                  num: "03",
                  title: "Make informed decisions",
                  desc: `Use real data from ${totalRespondents.toLocaleString()} verified responses to negotiate, plan your career trajectory, or understand your market value.`,
                },
              ].map((s) => (
                <div key={s.num} className="group">
                  <div className="text-[11px] font-mono text-brand-400 font-medium mb-3">{s.num}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200/40">
              <p className="text-xs text-slate-400 max-w-[640px] leading-relaxed">
                This tool does not collect, store, or transmit any data — all analysis runs entirely in your browser. Compensation data is crowdsourced from the 2025 Deloitte salary survey on Fishbowl ({totalRespondents.toLocaleString()} US respondents, filtered for quality). Not affiliated with Deloitte. For informational purposes only.
              </p>
              <p className="text-xs text-slate-400 max-w-[640px] leading-relaxed mt-2">
                FY27 survey data isn't out yet — we benchmark your new comp against FY26 responses. We'll refresh when new data is available.
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

        {/* Nav */}
        <nav className="relative z-10 max-w-[920px] mx-auto px-6 pt-8 pb-6 flex items-center justify-between">
          <button
            onClick={() => setStep(0)}
            className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <span>&larr;</span> Back
          </button>
          <span className="text-[12px] text-slate-300 font-mono">Step 1 of 2</span>
        </nav>

        <main className="relative z-10 max-w-[920px] mx-auto px-6 pb-16">
          <div className="mb-8 opacity-0 animate-fade-up">
            <h1 className="text-3xl sm:text-4xl text-slate-900 tracking-tight mb-2">
              Your compensation details
            </h1>
            <p className="text-slate-400 text-[15px]">
              Fill in what you know — only level and FY27 base are required.
            </p>
          </div>

          <div className="opacity-0 animate-fade-up-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left card */}
            <div className="bg-white rounded-md p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-brand-500 uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Level & Role
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Level *</label>
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
                  <label className={labelClasses}>Education Level</label>
                  <select className={inputClasses} value={form.education}
                    onChange={(e) => update("education", e.target.value)}>
                    <option value="">Select...</option>
                    {EDUCATION_LEVELS.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
                  </select>
                </div>

                {form.level === "Manager / Specialist Master" && (
                  <div>
                    <label className={labelClasses}>
                      Years at Manager level <span className="text-slate-300 font-normal normal-case tracking-normal">— optional</span>
                    </label>
                    <select className={inputClasses} value={form.yearsAtLevel}
                      onChange={(e) => update("yearsAtLevel", e.target.value)}>
                      <option value="">Select...</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="4">4 years</option>
                      <option value="5">5+ years</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Right card */}
            <div className="bg-white rounded-md p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-accent-600 uppercase tracking-[0.14em] mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-sm bg-accent-500" />
                Your Compensation
              </div>
              <div className="text-[11px] text-slate-400 font-mono mb-5 ml-3.5">FY26 &rarr; FY27</div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="space-y-4">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">FY26 <span className="text-slate-300 font-normal normal-case tracking-normal">(last year)</span></div>
                  <div>
                    <label className={labelClasses}>
                      Base <span className="text-slate-300 font-normal normal-case tracking-normal">— optional</span>
                    </label>
                    <input type="number" inputMode="numeric" placeholder="e.g. 135000" className={inputClasses}
                      value={form.fy26Base} onChange={(e) => update("fy26Base", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      AIP <span className="text-slate-300 font-normal normal-case tracking-normal">— optional</span>
                    </label>
                    <input type="number" inputMode="numeric" placeholder="e.g. 12000" className={inputClasses}
                      value={form.fy26Aip} onChange={(e) => update("fy26Aip", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] font-semibold text-accent-600 uppercase tracking-[0.12em]">FY27 <span className="text-slate-300 font-normal normal-case tracking-normal">(new statement)</span></div>
                  <div>
                    <label className={labelClasses}>Base *</label>
                    <input type="number" inputMode="numeric" placeholder="e.g. 145000" className={inputClasses}
                      value={form.fy27Base} onChange={(e) => update("fy27Base", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      AIP <span className="text-slate-300 font-normal normal-case tracking-normal">— optional</span>
                    </label>
                    <input type="number" inputMode="numeric" placeholder="e.g. 15000" className={inputClasses}
                      value={form.fy27Aip} onChange={(e) => update("fy27Aip", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-sm border-slate-300 text-accent-600 focus:ring-accent-500 cursor-pointer"
                    checked={form.promotedThisCycle}
                    onChange={(e) => update("promotedThisCycle", e.target.checked)}
                  />
                  <span className="text-[12px] text-slate-600 font-mono">I was promoted in this cycle (FY26 &rarr; FY27)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-fade-up-2 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              disabled={!canSubmit}
              onClick={() => {
                // Initialize exactly ONE toggle based on priority (Portfolio > Education > Segment)
                const hasPortfolio = form.portfolio && PORTFOLIO_STATS[form.level]?.[form.portfolio];
                const hasMba = form.education === "MBA" && MBA_STATS[form.level];
                if (hasPortfolio) {
                  setComparePortfolio(form.portfolio);
                  setCompareGroup("");
                  setCompareEdu("");
                } else if (hasMba) {
                  setCompareEdu("MBA");
                  setCompareGroup("");
                  setComparePortfolio("");
                } else {
                  setCompareGroup(form.gpsComm || "");
                  setCompareEdu("");
                  setComparePortfolio("");
                }
                setStep(2);
              }}
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-md text-[15px] font-semibold cursor-pointer transition-all hover:bg-slate-800 hover:-translate-y-0.5 disabled:opacity-20 disabled:cursor-not-allowed disabled:translate-y-0 active:scale-[0.98]"
            >
              See My Results &rarr;
            </button>
            {!canSubmit && (
              <span className="text-[12px] text-slate-300">Level and FY27 base are required</span>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── RESULTS ───
  return (
    <div className="min-h-screen font-sans relative">

      {/* Nav */}
      <nav className="relative z-10 max-w-[1000px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer font-medium flex items-center gap-1.5"
        >
          <span>&larr;</span> Edit inputs
        </button>
        <button
          onClick={() => setStep(0)}
          className="text-[12px] text-slate-300 hover:text-slate-500 transition-colors cursor-pointer font-medium"
        >
          Start over
        </button>
      </nav>

      {analysis && (
        <main className="relative z-10 max-w-[1000px] mx-auto px-6 pb-16">
          {/* Input summary */}
          <div className="mb-6 opacity-0 animate-fade-up flex flex-wrap items-center gap-2">
            {[
              form.level && form.level.split(" / ")[0],
              form.business,
              form.businessModel && form.businessModel !== "Core (Traditional)" && form.businessModel,
              form.portfolio,
              form.gpsComm,
              form.education,
            ].filter(Boolean).map((tag) => (
              <span key={tag} className="inline-flex items-center bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-[12px] font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Results header */}
          <div className="mb-8 opacity-0 animate-fade-up">
            <div className="text-[10px] text-slate-400 uppercase tracking-[0.12em] font-semibold mb-3">Your FY27 Compensation Analysis</div>
            <h1 className="text-4xl sm:text-5xl text-slate-900 tracking-tight mb-3">
              {analysis.pct}<span className="text-3xl align-top">th</span>
              <span className="text-slate-300 font-sans text-2xl font-normal ml-3">percentile</span>
            </h1>
            <p className="text-slate-400 text-sm">
              {form.level} &middot; {form.business || "All"}{form.gpsComm ? ` (${form.gpsComm})` : ""} &middot; n={analysis.stats.count} {analysis.peerLabel}
              {analysis.usdcData && <span> &middot; USDC</span>}
            </p>
          </div>

          {/* Insights */}
          <div className="mb-6 opacity-0 animate-fade-up-1">
            {analysis.insights.map((ins, i) => (
              <InsightChip key={i} text={ins.text} type={ins.type} />
            ))}
          </div>

          {/* Compare toggles */}
          <div className="mb-6 opacity-0 animate-fade-up-1 space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <CompareToggle
                label="Segment"
                options={[
                  { value: "", label: "All" },
                  { value: "GPS", label: "GPS" },
                  { value: "Commercial", label: "Commercial" },
                ]}
                value={compareGroup}
                onChange={(v) => { setCompareGroup(v); setCompareEdu(""); setComparePortfolio(""); }}
              />
              {MBA_STATS[form.level] && (
                <CompareToggle
                  label="Education"
                  options={[
                    { value: "", label: "All" },
                    { value: "MBA", label: "MBA" },
                    { value: "NonMBA", label: "Non-MBA" },
                  ]}
                  value={compareEdu}
                  onChange={(v) => { setCompareEdu(v); setCompareGroup(""); setComparePortfolio(""); }}
                />
              )}
            </div>
            {PORTFOLIO_STATS[form.level] && (
              <CompareToggle
                label="Portfolio"
                options={[
                  { value: "", label: "All OPs" },
                  ...Object.keys(PORTFOLIO_STATS[form.level]).map((p) => ({ value: p, label: p })),
                ]}
                value={comparePortfolio}
                onChange={(v) => { setComparePortfolio(v); setCompareGroup(""); setCompareEdu(""); }}
              />
            )}
          </div>

          {analysis.stats.count < 30 && (
            <div className="mb-4 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Small sample — treat with caution (n={analysis.stats.count})
            </div>
          )}

          {analysis.gpsCommDelta != null && !compareEdu && !comparePortfolio && (
            <div className="mb-6 opacity-0 animate-fade-up-1 bg-white rounded-md px-5 py-4 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-1">GPS vs Commercial Split</div>
                <p className="text-sm text-slate-500">
                  Commercial peers at your level earn a median of{" "}
                  <span className="font-mono font-semibold text-slate-700">{fmt(analysis.gpsCommDelta)}</span>{" "}
                  more than GPS peers.
                </p>
              </div>
              <div className="flex gap-3 text-center shrink-0 ml-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">GPS</div>
                  <div className="text-sm font-mono font-semibold text-slate-700">
                    {fmt(GPS_COMMERCIAL_STATS[form.level]?.GPS.salary.p50)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Commercial</div>
                  <div className="text-sm font-mono font-semibold text-slate-700">
                    {fmt(GPS_COMMERCIAL_STATS[form.level]?.Commercial.salary.p50)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {analysis.usdcData && (
            <UsdcContext usdcData={analysis.usdcData} level={form.level} />
          )}

          {/* Stat cards */}
          <div className="opacity-0 animate-fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="FY27 Base"
              value={fmt(analysis.fy27Base)}
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
              label={analysis.fy27Aip > 0 ? "FY27 AIP" : "AIP"}
              value={analysis.fy27Aip > 0 ? fmt(analysis.fy27Aip) : "—"}
              sub={`Median: ${fmt(analysis.stats.aip.p50)}`}
              accent="#f59e0b"
            />
            <StatCard
              label="FY27 Total Comp"
              value={fmt(analysis.fy27Tc)}
              sub={`Median: ${fmt(analysis.stats.tc.p50)}`}
              accent="#06b6d4"
            />
          </div>

          {/* Chart + Percentile */}
          <div className="opacity-0 animate-fade-up-3 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
            <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-5">
                Salary Distribution — Your Level
              </div>
              <BenchmarkChart
                userSalary={analysis.fy27Base}
                levelStats={analysis.stats}
                groupMedian={analysis.hasFilteredStats ? analysis.stats.salary.p50 : null}
                groupLabel={analysis.hasFilteredStats ? `${form.gpsComm} median` : null}
              />
            </div>

            <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-5">
                Percentile Position
              </div>
              <div className="text-center mb-5">
                <div className="text-6xl font-semibold font-mono text-slate-900 tracking-tighter leading-none">
                  {analysis.pct}<span className="text-2xl text-slate-300 align-top ml-0.5">th</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">base salary percentile</div>
              </div>
              <PercentileBar percentile={analysis.pct} />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[["P25", analysis.stats.salary.p25], ["Median", analysis.stats.salary.p50],
                  ["P75", analysis.stats.salary.p75], ["P90", analysis.stats.salary.p90]].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-sm px-3 py-2.5">
                    <div className="text-[10px] text-slate-400 font-medium">{label}</div>
                    <div className="text-[14px] font-semibold font-mono text-slate-700">{fmt(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Salary Range */}
          <div className="opacity-0 animate-fade-up-4 mb-4">
            <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-4">Full Salary Range</div>
              <div className="relative h-2 bg-slate-100 rounded-full my-6">
                <div
                  className="absolute h-full bg-gradient-to-r from-brand-300 to-brand-500 rounded-full"
                  style={{
                    left: `${((analysis.stats.salary.p25 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                    right: `${100 - ((analysis.stats.salary.p75 - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100}%`,
                  }}
                />
                <div
                  className="absolute w-3 h-3 bg-accent-500 rounded-sm top-1/2 -mt-1.5 border-2 border-white"
                  style={{
                    left: `${Math.min(100, Math.max(0, ((analysis.fy27Base - analysis.stats.salary.p10) / (analysis.stats.salary.p90 - analysis.stats.salary.p10)) * 100))}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-4">
                <span>{fmt(analysis.stats.salary.p10)}</span>
                <span>{fmt(analysis.stats.salary.p90)}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-3">
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-brand-400 mr-1 align-middle" /> P25–P75</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm bg-accent-500 mr-1 align-middle" /> You</span>
              </div>
              <div className="bg-slate-50 rounded-sm p-3">
                <div className="text-[12px] text-slate-500">
                  Gap to P75:{" "}
                  <span className={`font-mono font-semibold ${analysis.fy27Base >= analysis.stats.salary.p75 ? "text-emerald-600" : "text-amber-600"}`}>
                    {analysis.fy27Base >= analysis.stats.salary.p75 ? "Above P75" : fmt(analysis.stats.salary.p75 - analysis.fy27Base)}
                  </span>
                </div>
                {analysis.fy27Base < analysis.stats.salary.p75 && (
                  <div className="text-[11px] text-slate-400 mt-1">
                    Gap to P90: <span className="font-mono">{fmt(analysis.stats.salary.p90 - analysis.fy27Base)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Predicted vs Actual */}
          <div className="mb-6 bg-white rounded-md border border-slate-200">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
                  Predicted vs Actual
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">FY25 → FY26 survey · n={NON_PROMOTION_RAISE.n + Object.values(PROMOTION_RAISES).reduce((s, d) => s + d.n, 0)}</div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tabular-nums">FY27 survey · Jun/Jul 2026</div>
            </div>

            <div className="px-5 sm:px-6 py-4 bg-amber-50/40 border-b border-slate-200">
              <div className="flex items-start gap-2 text-[12px] text-slate-600 leading-relaxed">
                <div className="w-1 h-1 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Rating system changed this cycle — we can't project your FY27 raise from your new rating. Reference ranges below are from last year's data.</span>
              </div>
            </div>

            {analysis.raiseAnalysis ? (
              <div className="px-5 sm:px-6 py-5 border-b border-slate-200">
                <div className="text-[12px] text-slate-500 mb-4">
                  Based on FY26 trends, typical raise for {analysis.raiseAnalysis.label}: <span className="font-mono font-semibold text-slate-900">{(analysis.raiseAnalysis.median * 100).toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-3 gap-px bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
                  <div className="bg-white p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] font-semibold mb-2 font-mono text-slate-400">Predicted FY27</div>
                    <div className="text-xl sm:text-2xl font-semibold font-mono tabular-nums text-slate-900">{fmt(analysis.raiseAnalysis.predictedBase)}</div>
                    <div className="text-[10px] mt-1 font-mono text-slate-400">FY26 × {(analysis.raiseAnalysis.median * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white p-4 relative">
                    <div className="absolute top-0 left-0 h-full w-[2px] bg-accent-500" />
                    <div className="text-[9px] uppercase tracking-[0.14em] font-semibold mb-2 font-mono text-accent-700">Actual FY27</div>
                    <div className="text-xl sm:text-2xl font-semibold font-mono tabular-nums text-accent-600">{fmt(analysis.fy27Base)}</div>
                    <div className="text-[10px] mt-1 font-mono text-accent-700">+{(analysis.raiseAnalysis.actualPct * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] font-semibold mb-2 font-mono text-slate-400">Delta</div>
                    <div className={`text-xl sm:text-2xl font-semibold font-mono tabular-nums ${analysis.raiseAnalysis.predictedDelta >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {analysis.raiseAnalysis.predictedDelta >= 0 ? "+" : ""}{fmt(analysis.raiseAnalysis.predictedDelta)}
                    </div>
                    <div className="text-[10px] mt-1 font-mono text-slate-400">vs prediction</div>
                  </div>
                </div>
                <div className={`mt-4 text-[12px] font-mono ${analysis.raiseAnalysis.verdict === "below" ? "text-amber-700" : "text-emerald-700"}`}>
                  Your {(analysis.raiseAnalysis.actualPct * 100).toFixed(1)}% raise is {analysis.raiseAnalysis.verdict === "in line" ? "in line with" : analysis.raiseAnalysis.verdict === "above" ? `${(analysis.raiseAnalysis.deltaPp * 100).toFixed(1)}pp above` : `${Math.abs(analysis.raiseAnalysis.deltaPp * 100).toFixed(1)}pp below`} the {(analysis.raiseAnalysis.median * 100).toFixed(1)}% typical for {analysis.raiseAnalysis.label}.
                </div>
              </div>
            ) : (
              <div className="px-5 sm:px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <div className="text-[12px] text-slate-500">
                  Enter your FY26 base to see how your FY27 raise compares to FY26 cohort trends.
                </div>
              </div>
            )}

            {(() => {
              const highlightedCohort = analysis.raiseAnalysis?.cohort
                ?? (analysis.promoNext ? "next-promo" : null);
              const Tile = ({ k, label, value, n, sub, highlighted }) => (
                <div key={k} className="bg-white p-4 relative">
                  {highlighted && <div className="absolute top-0 left-0 h-full w-[2px] bg-accent-500" />}
                  <div className={`text-[9px] uppercase tracking-[0.14em] font-semibold mb-2 font-mono ${highlighted ? "text-accent-700" : "text-slate-400"}`}>{label}</div>
                  <div className={`text-2xl font-semibold font-mono tabular-nums ${highlighted ? "text-accent-600" : "text-slate-900"}`}>{value}</div>
                  <div className={`text-[10px] mt-1 font-mono ${highlighted ? "text-accent-700" : "text-slate-400"}`}>{sub} · n={n}</div>
                </div>
              );
              return (
                <div className={`grid gap-px bg-slate-100 ${analysis.promoNext ? "grid-cols-3" : "grid-cols-2"}`}>
                  {analysis.promoInto && Tile({
                    k: "into",
                    label: `${analysis.promoInto.fromLabel} → ${analysis.promoInto.toLabel}`,
                    value: `${(analysis.promoInto.median * 100).toFixed(1)}%`,
                    n: analysis.promoInto.n,
                    sub: highlightedCohort === "promoted" ? "your promotion" : "promoted into level",
                    highlighted: highlightedCohort === "promoted",
                  })}
                  {analysis.promoNext && Tile({
                    k: "next",
                    label: `${analysis.promoNext.fromLabel} → ${analysis.promoNext.toLabel}`,
                    value: `${(analysis.promoNext.median * 100).toFixed(1)}%`,
                    n: analysis.promoNext.n,
                    sub: "next promotion",
                    highlighted: highlightedCohort === "next-promo",
                  })}
                  {Tile({
                    k: "same",
                    label: "Stayed Same Level",
                    value: `${(NON_PROMOTION_RAISE.median * 100).toFixed(1)}%`,
                    n: NON_PROMOTION_RAISE.n,
                    sub: highlightedCohort === "same-level" ? "your cohort" : "median",
                    highlighted: highlightedCohort === "same-level",
                  })}
                </div>
              );
            })()}

            <div className="px-5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.14em] font-semibold mb-2 font-mono">All Promotion Paths · Reference</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-[11px] font-mono tabular-nums">
                {Object.entries(PROMOTION_RAISES).map(([lvl, d]) => (
                  <div key={lvl} className="flex items-baseline justify-between">
                    <span className="text-slate-500 truncate">{d.fromLabel} → {d.toLabel}</span>
                    <span className="text-slate-900 font-semibold tabular-nums ml-2">{(d.median * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Years at Manager Level */}
          {analysis.yearsContext && (
            <div className="mb-6 bg-white rounded-md p-5 sm:p-6 border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-3">
                Manager Base by Years at Level
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(analysis.yearsContext.buckets).map(([year, d]) => {
                  const isUser = analysis.yearsContext.userYear === parseInt(year, 10);
                  const smallN = d.n < 30;
                  return (
                    <div key={year} className={`text-center p-3 rounded-sm ${isUser ? "bg-brand-50 border border-brand-200" : "bg-slate-50"}`}>
                      <div className="text-[10px] text-slate-400 font-semibold mb-1">{year === "5" ? "5+ yrs" : `${year} yr${year === "1" ? "" : "s"}`}</div>
                      <div className={`text-base font-semibold font-mono ${isUser ? "text-brand-700" : "text-slate-700"}`}>{fmt(d.median)}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${smallN ? "text-amber-500" : "text-slate-300"}`}>n={d.n}{smallN ? " ⚠" : ""}</div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-400">Median base salary by tenure at Manager level. {Object.values(analysis.yearsContext.buckets).some(d => d.n < 30) && <span className="text-amber-600">⚠ = small sample (n&lt;30)</span>}</p>
            </div>
          )}


          {/* AIP comparison */}
          <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200 mb-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-4">
              AIP Benchmarks — {form.level}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["Your FY27 AIP", analysis.fy27Aip > 0 ? fmt(analysis.fy27Aip) : "—", analysis.fy27Aip > 0 && analysis.fy27Aip >= analysis.stats.aip.p50 ? "text-emerald-600" : "text-slate-400"],
                ["P25 AIP", fmt(analysis.stats.aip.p25), "text-slate-500"],
                ["Median AIP", fmt(analysis.stats.aip.p50), "text-brand-600"],
                ["P75 AIP", fmt(analysis.stats.aip.p75), "text-slate-500"],
              ].map(([label, val, colorClass]) => (
                <div key={label} className="text-center p-4 bg-slate-50 rounded-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-semibold">{label}</div>
                  <div className={`text-xl font-semibold font-mono ${colorClass}`}>{val}</div>
                </div>
              ))}
            </div>
            {analysis.fy26Aip != null && (
              <p className="mt-3 text-[11px] text-slate-400 font-mono">
                FY26 AIP for context: <span className="text-slate-600 font-semibold">{fmt(analysis.fy26Aip)}</span> (median was {fmt(analysis.stats.aip.p50)})
              </p>
            )}
          </div>

          {/* Footnote */}
          <div className="p-4 border-t border-slate-100 mt-8 space-y-2">
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-400">Source:</strong> 2025 Deloitte compensation survey (FY26) on Fishbowl &middot; {totalRespondents.toLocaleString()} US respondents &middot; Not affiliated with Deloitte. FY27 data will be incorporated once the next survey is available.
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-400">Privacy:</strong> No data is collected, stored, or transmitted. All analysis runs entirely in your browser.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
