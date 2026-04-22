# Salary Analyzer FY26 Refresh — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the analyzer so it compares a user's *current* salary against FY26 peer data (no FY25/FY26 split in inputs), drops the now-invalid rating projections, and preserves still-valid raise/promotion context.

**Architecture:** Two phases. Phase A regenerates `src/data/salaryData.js` from the 2025 XLSX using a committed Python script, switching the base salary column from FY25 to FY26. Phase B simplifies the React UI: one salary input, optional raise %, rating section removed, replaced with a "Looking ahead" note.

**Tech Stack:** React 18 + Vite (frontend, unchanged). Python 3 + openpyxl + numpy (one-shot data regeneration, new).

**Design doc:** `docs/plans/2026-04-21-salary-analyzer-fy26-refresh-design.md`

**Testing note:** The project has no test framework. For the Python script, use `assert` checks embedded in the script (sanity bounds on row counts and percentile ordering). For UI, verify manually in `npm run dev`.

---

## Phase A — Data regeneration

### Task A1: Scaffold the recompute script

**Files:**
- Create: `scripts/recompute_stats_fy26.py`
- Create: `scripts/requirements.txt`

**Step 1: Create requirements**

`scripts/requirements.txt`:
```
openpyxl>=3.1
numpy>=1.26
```

**Step 2: Create skeleton script**

`scripts/recompute_stats_fy26.py`:
```python
"""Recompute src/data/salaryData.js from the 2025 Deloitte Salary Survey XLSX.

Base salary benchmarks are computed against the FY26 Base Salary column
(respondents' post-June-2025 salaries). Raise and promotion stats are
computed against FY25->FY26 percent change, unchanged from the prior run.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import openpyxl

REPO_ROOT = Path(__file__).resolve().parents[1]
XLSX_PATH = REPO_ROOT / "2025 Deloitte Salary Survey Responses.xlsx"
OUT_PATH = REPO_ROOT / "src" / "data" / "salaryData.js"


def load_rows() -> list[dict]:
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    headers = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    rows = []
    for raw in ws.iter_rows(min_row=2, values_only=True):
        rows.append(dict(zip(headers, raw)))
    return rows


def main() -> None:
    rows = load_rows()
    print(f"Loaded {len(rows)} raw rows", file=sys.stderr)


if __name__ == "__main__":
    main()
```

**Step 3: Run to confirm it loads**

```bash
cd /Users/rafeealam/Documents/deloitte-salary-analyzer
python3 -m pip install -r scripts/requirements.txt
python3 scripts/recompute_stats_fy26.py
```
Expected: `Loaded 1934 raw rows` on stderr.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py scripts/requirements.txt
git commit -m "chore: scaffold FY26 stats recompute script"
```

---

### Task A2: Row filtering and level/business normalization

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add filtering + normalization helpers**

Add above `main()`:

```python
LEVEL_ORDER = [
    "Analyst / Jr Staff",
    "Consultant / Staff",
    "Senior Consultant / Specialist Senior / Senior",
    "Manager / Specialist Master",
    "Senior Manager / Specialist Leader",
]


def normalize_business(raw: str | None) -> str | None:
    if not raw:
        return None
    s = raw.strip()
    if s in ("Consulting", "Advisory"):
        return "Consulting Services"
    if s in ("Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"):
        return s
    return None


def clean(rows: list[dict]) -> list[dict]:
    out = []
    for r in rows:
        fy26 = r.get("FY26 Base Salary (USD)")
        level = r.get("FY26 Level")
        if not isinstance(fy26, (int, float)) or fy26 <= 0:
            continue
        if level not in LEVEL_ORDER:
            continue
        if r.get("Data Quality Concern"):
            continue
        out.append(r)
    return out
```

**Step 2: Wire into main**

Replace `main()` body with:
```python
raw = load_rows()
rows = clean(raw)
print(f"Raw: {len(raw)}  Clean: {len(rows)}", file=sys.stderr)
assert 1500 <= len(rows) <= 1900, f"Unexpected clean row count: {len(rows)}"
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py
```
Expected: `Raw: 1934  Clean: ~1700-1800` on stderr. Exact count may differ from prior 1,767 (different filter on FY26 vs FY25 base); that's acceptable as long as within 1500–1900.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py
git commit -m "chore: add row filtering and business normalization"
```

---

### Task A3: Percentile helper + LEVEL_STATS computation

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add percentile helper**

```python
def pct_block(values: list[float], *, include_p10_p90: bool = True) -> dict:
    arr = np.array([v for v in values if isinstance(v, (int, float)) and v > 0], dtype=float)
    if len(arr) == 0:
        return {}
    out = {
        "p25": float(np.percentile(arr, 25)),
        "p50": float(np.percentile(arr, 50)),
        "p75": float(np.percentile(arr, 75)),
        "mean": float(arr.mean()),
    }
    if include_p10_p90:
        out["p10"] = float(np.percentile(arr, 10))
        out["p90"] = float(np.percentile(arr, 90))
    return out


def salary_stats(rows: list[dict]) -> dict:
    salary = pct_block([r["FY26 Base Salary (USD)"] for r in rows])
    aip = pct_block([r.get("AIP (USD)") or 0 for r in rows], include_p10_p90=False)
    tc_values = [
        (r["FY26 Base Salary (USD)"] or 0) + (r.get("AIP (USD)") or 0)
        for r in rows
    ]
    tc = pct_block(tc_values, include_p10_p90=False)
    return {
        "count": len(rows),
        "salary": {k: round(v) for k, v in salary.items()},
        "aip": {k: round(v) for k, v in aip.items()},
        "tc": {k: round(v) for k, v in tc.items() if k in ("p25", "p50", "p75")},
    }


def level_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER:
        subset = [r for r in rows if r["FY26 Level"] == lvl]
        out[lvl] = salary_stats(subset)
        assert out[lvl]["salary"]["p25"] <= out[lvl]["salary"]["p50"] <= out[lvl]["salary"]["p75"], lvl
    return out
```

**Step 2: Wire into main**

Append:
```python
level = level_stats(rows)
print(json.dumps({"LEVEL_STATS": level}, indent=2), file=sys.stderr)
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py 2>&1 | head -80
```
Expected: JSON with five levels, each having `count`, `salary` (p10/p25/p50/p75/p90/mean), `aip`, `tc`. Every level's P50 should be higher than the old FY25 P50 (since these are post-raise numbers). For reference, old FY25 Manager P50 was $183,200 — the FY26 value should be ~$193–200k.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py
git commit -m "chore: compute LEVEL_STATS against FY26 base"
```

---

### Task A4: Business, GPS/Commercial, Portfolio breakdowns

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add breakdown helpers**

```python
PORTFOLIO_ORDER = [
    "AI & Engineering",
    "Strategy & Transactions",
    "Customer",
    "Human Capital",
    "Enterprise Performance",
    "Cyber",
    "Finance Transformation",
    "Regulatory, Risk & Forensic",
    "Other",
]
MIN_N_PORTFOLIO = 30


def business_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER:
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        out[lvl] = {}
        for biz in ("Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"):
            subset = [r for r in lvl_rows if normalize_business(r.get("FY26 Global Business")) == biz]
            if len(subset) >= 10:
                out[lvl][biz] = salary_stats(subset)
    return out


def gps_commercial_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER:
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        out[lvl] = {}
        for key in ("GPS", "Commercial"):
            subset = [r for r in lvl_rows if (r.get("GPS or Commercial") or "").strip() == key]
            if len(subset) >= 10:
                out[lvl][key] = salary_stats(subset)
    return out


def portfolio_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER:
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        level_block = {}
        for p in PORTFOLIO_ORDER:
            subset = [r for r in lvl_rows if (r.get("FY26 Offering Portfolio") or "").strip() == p]
            if len(subset) >= MIN_N_PORTFOLIO:
                level_block[p] = salary_stats(subset)
        if level_block:
            out[lvl] = level_block
    return out
```

**Step 2: Wire into main + sanity print**

Append to main:
```python
biz = business_stats(rows)
gps = gps_commercial_stats(rows)
port = portfolio_stats(rows)
print(f"Businesses per level: {[len(biz[l]) for l in LEVEL_ORDER]}", file=sys.stderr)
print(f"GPS/Comm per level:   {[len(gps[l]) for l in LEVEL_ORDER]}", file=sys.stderr)
print(f"Portfolios per level: {[len(port.get(l, {})) for l in LEVEL_ORDER]}", file=sys.stderr)
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py 2>&1 | tail -10
```
Expected: Businesses mostly 1–4 per level (Consulting Services dominates), GPS/Comm should be 2 per level, portfolios 3–8 per level for mid-career, fewer at extremes.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py
git commit -m "chore: add business, GPS/comm, portfolio breakdowns"
```

---

### Task A5: USDC, MBA, MBA_PREMIUM, years-at-level

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add helpers**

```python
def usdc_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER[:4]:  # no USDC data at Senior Manager in prior output
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        block = {}
        for key, match in (("USDC", "USDC"), ("Core", "Core (Traditional)")):
            subset = [r for r in lvl_rows if (r.get("Talent Model") or "").strip() == match]
            if len(subset) >= 10:
                salary = pct_block(
                    [r["FY26 Base Salary (USD)"] for r in subset],
                    include_p10_p90=False,
                )
                block[key] = {
                    "count": len(subset),
                    "salary": {k: round(v) for k, v in salary.items() if k in ("p25", "p50", "p75")},
                }
        if "USDC" in block and "Core" in block:
            out[lvl] = block
    return out


def mba_stats(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER[1:]:  # MBA stats skip Analyst
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        mba = [r for r in lvl_rows if (r.get("Education Level") or "").strip() == "MBA"]
        non = [r for r in lvl_rows if (r.get("Education Level") or "").strip() and (r.get("Education Level") or "").strip() != "MBA"]
        if len(mba) >= 20 and len(non) >= 20:
            out[lvl] = {"MBA": salary_stats(mba), "NonMBA": salary_stats(non)}
    return out


def mba_premium(rows: list[dict]) -> dict:
    out = {}
    for lvl in LEVEL_ORDER[1:]:
        lvl_rows = [r for r in rows if r["FY26 Level"] == lvl]
        mba = [r["FY26 Base Salary (USD)"] for r in lvl_rows if (r.get("Education Level") or "").strip() == "MBA"]
        bach = [r["FY26 Base Salary (USD)"] for r in lvl_rows if (r.get("Education Level") or "").strip() == "Bachelor's"]
        if len(mba) >= 20 and len(bach) >= 20:
            m_med = float(np.median(mba))
            b_med = float(np.median(bach))
            out[lvl] = {
                "mba": {"n": len(mba), "median": round(m_med)},
                "bachelors": {"n": len(bach), "median": round(b_med)},
                "delta": round(m_med - b_med),
                "deltaPct": round((m_med - b_med) / b_med, 3),
            }
    return out


def years_at_level_manager(rows: list[dict]) -> dict:
    mgr = [r for r in rows if r["FY26 Level"] == "Manager / Specialist Master"]
    out = {}
    for y in (1, 2, 3, 4, 5):
        subset = [r for r in mgr if r.get("Rounded Years at level") == y]
        if len(subset) >= 10:
            out[y] = {
                "n": len(subset),
                "median": round(float(np.median([r["FY26 Base Salary (USD)"] for r in subset]))),
            }
    return out
```

**Step 2: Wire into main**

Append:
```python
usdc = usdc_stats(rows)
mba = mba_stats(rows)
premium = mba_premium(rows)
years = years_at_level_manager(rows)
print(f"USDC levels: {list(usdc)}", file=sys.stderr)
print(f"MBA levels:  {list(mba)}", file=sys.stderr)
print(f"Premium:     {list(premium)}", file=sys.stderr)
print(f"Years(mgr):  {years}", file=sys.stderr)
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py 2>&1 | tail -10
```
Expected: USDC levels list has 3–4 entries. MBA levels has Consultant through Senior Manager. Years years keys 1–5 with n≥10 each.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py
git commit -m "chore: add USDC, MBA, MBA premium, years-at-level stats"
```

---

### Task A6: Promotion + non-promotion raise stats (FY25→FY26)

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add helpers**

```python
LEVEL_TO_PREV = {
    "Consultant / Staff": "Analyst / Jr Staff",
    "Senior Consultant / Specialist Senior / Senior": "Consultant / Staff",
    "Manager / Specialist Master": "Senior Consultant / Specialist Senior / Senior",
    "Senior Manager / Specialist Leader": "Manager / Specialist Master",
}
FROM_LABEL = {
    "Consultant / Staff": ("Analyst", "Consultant"),
    "Senior Consultant / Specialist Senior / Senior": ("Consultant", "Senior Consultant"),
    "Manager / Specialist Master": ("Senior Consultant", "Manager"),
    "Senior Manager / Specialist Leader": ("Manager", "Senior Manager"),
}


def raise_pct(r: dict) -> float | None:
    fy25 = r.get("FY25 Base Salary (USD)")
    fy26 = r.get("FY26 Base Salary (USD)")
    if not (isinstance(fy25, (int, float)) and fy25 > 0 and isinstance(fy26, (int, float)) and fy26 > 0):
        return None
    return (fy26 - fy25) / fy25


def promotion_raises(rows: list[dict]) -> dict:
    out = {}
    for to_level, from_level in LEVEL_TO_PREV.items():
        subset = [
            raise_pct(r) for r in rows
            if r.get("FY26 Level") == to_level and r.get("FY25 Level") == from_level
        ]
        subset = [x for x in subset if x is not None and -0.5 < x < 1.0]
        if len(subset) >= 10:
            f_lbl, t_lbl = FROM_LABEL[to_level]
            out[to_level] = {
                "n": len(subset),
                "median": round(float(np.median(subset)), 4),
                "fromLabel": f_lbl,
                "toLabel": t_lbl,
            }
    return out


def non_promotion_raise(rows: list[dict]) -> dict:
    subset = [
        raise_pct(r) for r in rows
        if r.get("FY25 Level") == r.get("FY26 Level")
    ]
    subset = [x for x in subset if x is not None and -0.5 < x < 1.0]
    return {
        "n": len(subset),
        "median": round(float(np.median(subset)), 4),
        "p25": round(float(np.percentile(subset, 25)), 4),
        "p75": round(float(np.percentile(subset, 75)), 4),
    }
```

**Step 2: Wire into main**

Append:
```python
promos = promotion_raises(rows)
non_promo = non_promotion_raise(rows)
print(f"Promos: {promos}", file=sys.stderr)
print(f"Non-promo: {non_promo}", file=sys.stderr)
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py 2>&1 | tail -4
```
Expected: Promotion medians around 0.10–0.15 (matching prior output). Non-promo median around 0.055, n≈1,200+.

**Step 4: Commit**

```bash
git add scripts/recompute_stats_fy26.py
git commit -m "chore: add promotion and non-promotion raise stats"
```

---

### Task A7: Write salaryData.js output

**File:** `scripts/recompute_stats_fy26.py`

**Step 1: Add JS writer**

Add near the imports:
```python
HEADER = '''// Stats recomputed from 2025 Deloitte Salary Survey Responses.xlsx
// Base salary benchmarks are computed against the FY26 Base Salary column
// (respondents' post-June-2025 salaries).
// Raise stats are FY25->FY26 percent change.
// Regenerate with: python3 scripts/recompute_stats_fy26.py
'''


def as_js(name: str, value) -> str:
    return f"export const {name} = {json.dumps(value, indent=2)};\n\n"


def write_js(out: dict) -> None:
    parts = [HEADER + "\n"]
    parts.append(as_js("LEVEL_STATS", out["level"]))
    parts.append(as_js("GPS_COMMERCIAL_STATS", out["gps"]))
    parts.append(as_js("BUSINESS_STATS", out["biz"]))
    parts.append(as_js("PORTFOLIO_STATS", out["port"]))
    parts.append(as_js("USDC_STATS", out["usdc"]))
    parts.append(as_js("MBA_STATS", out["mba"]))
    parts.append(as_js("MBA_PREMIUM", out["premium"]))
    parts.append(as_js("YEARS_AT_LEVEL_MANAGER", out["years"]))
    parts.append(as_js("PROMOTION_RAISES", out["promos"]))
    parts.append(as_js("NON_PROMOTION_RAISE", out["non_promo"]))

    parts.append("export const LEVELS = Object.keys(LEVEL_STATS);\n")
    parts.append('export const BUSINESSES = ["Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"];\n')
    parts.append("export const PORTFOLIOS = " + json.dumps(PORTFOLIO_ORDER) + ";\n")
    parts.append('export const GPS_COMM = ["Commercial", "GPS"];\n')
    parts.append('export const EDUCATION_LEVELS = ["Bachelor\\u0027s", "Non-MBA Master\\u0027s", "MBA", "PhD / Other"];\n')
    parts.append('export const BUSINESS_MODELS = ["Core (Traditional)", "USDC"];\n')
    parts.append("export const NEXT_LEVEL = " + json.dumps({
        "Analyst / Jr Staff": "Consultant / Staff",
        "Consultant / Staff": "Senior Consultant / Specialist Senior / Senior",
        "Senior Consultant / Specialist Senior / Senior": "Manager / Specialist Master",
        "Manager / Specialist Master": "Senior Manager / Specialist Leader",
    }) + ";\n\n")
    parts.append(f"export const totalRespondents = {out['count']};\n")

    OUT_PATH.write_text("".join(parts))
```

**Step 2: Wire into main**

Replace the print-only tail of `main()` with:
```python
write_js({
    "count": len(rows),
    "level": level,
    "gps": gps,
    "biz": biz,
    "port": port,
    "usdc": usdc,
    "mba": mba,
    "premium": premium,
    "years": years,
    "promos": promos,
    "non_promo": non_promo,
})
print(f"Wrote {OUT_PATH} ({len(rows)} respondents)", file=sys.stderr)
```

**Step 3: Run and verify**

```bash
python3 scripts/recompute_stats_fy26.py
head -20 src/data/salaryData.js
```
Expected: New header, `LEVEL_STATS` with higher P50s than prior FY25 values. No `CONSOLIDATED_RATING_RAISES`, no `CLIENT_RATING_RAISES`, no `CLIENT_RATINGS`, no `CONSOLIDATED_RATINGS`.

**Step 4: Sanity-check by building**

```bash
npm run build
```
Expected: Build fails in `DeloitteSalaryAnalyzer.jsx` because it still imports the removed rating constants. That's expected — we fix it in Phase B. Do not commit yet if the build fails only for that reason.

Actually, commit anyway since the data file is the source of truth for Phase B:

**Step 5: Commit**

```bash
git add scripts/recompute_stats_fy26.py src/data/salaryData.js
git commit -m "feat(data): regenerate stats against FY26 base salary, drop rating slices"
```

---

## Phase B — UI simplification

### Task B1: Simplify form state

**File:** `src/components/DeloitteSalaryAnalyzer.jsx:116-130` (the `useState({...})` initial form object)

**Step 1: Replace form initial state**

Current (approx lines 115–132):
```js
const [form, setForm] = useState({
  level: "",
  fy25Salary: "",
  fy25Aip: "",
  fy26Salary: "",
  fy26Aip: "",
  business: "",
  portfolio: "",
  gpsComm: "",
  businessModel: "",
  education: "",
  clientRating: "",
  consolidatedRating: "",
});
```

Replace with:
```js
const [form, setForm] = useState({
  level: "",
  currentSalary: "",
  currentAip: "",
  lastRaisePct: "",
  business: "",
  portfolio: "",
  gpsComm: "",
  businessModel: "",
  education: "",
});
```

**Step 2: Update imports**

At top of file, remove `CLIENT_RATINGS`, `CONSOLIDATED_RATINGS`, `CONSOLIDATED_RATING_RAISES`, `CLIENT_RATING_RAISES` from the import list.

**Step 3: Do not commit yet** — the rest of the file still references the old state; commit after B2–B4.

---

### Task B2: Rewrite analysis memo to use currentSalary / lastRaisePct

**File:** `src/components/DeloitteSalaryAnalyzer.jsx` — the large `useMemo` block (approx lines 140–290)

**Step 1: Replace the memo body**

Find `if (!form.level || !form.fy25Salary) return null;` and replace the entire memo body with a simplified version that:
- Parses `currentSalary` and `currentAip`
- Optionally parses `lastRaisePct` into `raiseRate` (accepts "7" or "7%" or "0.07"; divide if > 1)
- Drops all `fy26Sal`, `fy26Tc`, `projectedFy26`, `ratingRaiseData`, `ratingLabel`, `consolidatedRaiseData`, `clientRaiseData` logic
- Uses `currentSalary` wherever `fy25Sal` was used for benchmark comparisons

Full replacement memo:
```js
const analysis = useMemo(() => {
  if (!form.level || !form.currentSalary) return null;
  const currentSal = parseFloat(form.currentSalary);
  if (!Number.isFinite(currentSal) || currentSal <= 0) return null;

  const rawAip = parseFloat(form.currentAip);
  const currentAip = Number.isFinite(rawAip) && rawAip >= 0 ? rawAip : 0;
  const currentTc = currentSal + currentAip;

  let raiseRate = null;
  if (form.lastRaisePct) {
    const cleaned = String(form.lastRaisePct).replace("%", "").trim();
    const parsed = parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      raiseRate = parsed > 1 ? parsed / 100 : parsed;
    }
  }

  const stats = LEVEL_STATS[form.level];
  if (!stats) return null;

  const pct = getPercentile(currentSal, stats.salary);
  const vsMedian = currentSal - stats.salary.p50;

  const insights = [];
  if (pct >= 75) insights.push({ text: `${pct}th percentile — top quartile`, type: "good" });
  else if (pct >= 50) insights.push({ text: `${pct}th percentile — above median`, type: "good" });
  else if (pct >= 25) insights.push({ text: `${pct}th percentile — below median`, type: "warn" });
  else insights.push({ text: `${pct}th percentile — bottom quartile`, type: "warn" });

  if (vsMedian > 0) insights.push({ text: `+${fmt(vsMedian)} vs ${form.level} median`, type: "good" });
  else insights.push({ text: `${fmt(vsMedian)} vs ${form.level} median`, type: "warn" });

  if (currentAip > 0) {
    const aipVsMedian = currentAip - stats.aip.p50;
    if (aipVsMedian > 0) insights.push({ text: `AIP ${fmt(currentAip)} — +${fmt(aipVsMedian)} above median`, type: "good" });
    else insights.push({ text: `AIP ${fmt(currentAip)} — ${fmt(aipVsMedian)} vs median`, type: "warn" });
  }

  // Raise vs peers (only if user entered raise %)
  let raiseContext = null;
  if (raiseRate != null) {
    const vsOverall = raiseRate - NON_PROMOTION_RAISE.median;
    raiseContext = {
      userPct: raiseRate,
      peerMedian: NON_PROMOTION_RAISE.median,
      peerP25: NON_PROMOTION_RAISE.p25,
      peerP75: NON_PROMOTION_RAISE.p75,
      peerN: NON_PROMOTION_RAISE.n,
      vsOverall,
    };
  }

  return {
    currentSal, currentAip, currentTc,
    raiseRate, raiseContext,
    stats, pct, vsMedian,
    insights,
    level: form.level,
    business: form.business,
    portfolio: form.portfolio,
    gpsComm: form.gpsComm,
    businessModel: form.businessModel,
    education: form.education,
  };
}, [form]);
```

**Step 2: Update `canSubmit` (approx line 295–296)**

Replace:
```js
const parsedSalary = parseFloat(form.fy25Salary);
const canSubmit = form.level && form.fy25Salary && Number.isFinite(parsedSalary) && parsedSalary > 0;
```

With:
```js
const parsedSalary = parseFloat(form.currentSalary);
const canSubmit = form.level && form.currentSalary && Number.isFinite(parsedSalary) && parsedSalary > 0;
```

**Step 3: Do not commit yet.**

---

### Task B3: Rewrite the input form JSX

**File:** `src/components/DeloitteSalaryAnalyzer.jsx` — the form section (approx lines 440–570)

**Step 1: Replace salary/AIP and rating sections**

Delete the JSX blocks:
- FY25 Client Rating `<select>` (approx lines 493–502)
- Consolidated Rating `<select>` (approx lines 503–514)
- FY25 Compensation section with two inputs (approx lines 525–545)
- FY26 Compensation section with two inputs (approx lines 547–565)

Replace with a single compensation block:
```jsx
<div className="md:col-span-2 mt-2">
  <div className="text-[11px] text-stone-400 uppercase tracking-[0.12em] font-semibold mb-2">
    Current Compensation
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <label className={labelClasses}>Current base salary *</label>
      <input type="number" inputMode="numeric" placeholder="e.g. 145000" className={inputClasses}
        value={form.currentSalary} onChange={(e) => update("currentSalary", e.target.value)} />
    </div>
    <div>
      <label className={labelClasses}>AIP received <span className="text-stone-300 font-normal normal-case tracking-normal">— optional</span></label>
      <input type="number" inputMode="numeric" placeholder="e.g. 15000" className={inputClasses}
        value={form.currentAip} onChange={(e) => update("currentAip", e.target.value)} />
    </div>
  </div>
</div>

<div className="md:col-span-2 mt-2">
  <div className="text-[11px] text-stone-400 uppercase tracking-[0.12em] font-semibold mb-2">
    Last Raise <span className="text-stone-300 font-normal normal-case tracking-normal">— optional, compares your June 2025 bump to peers</span>
  </div>
  <div>
    <label className={labelClasses}>Raise %</label>
    <input type="text" inputMode="decimal" placeholder="e.g. 7 or 7%" className={inputClasses}
      value={form.lastRaisePct} onChange={(e) => update("lastRaisePct", e.target.value)} />
  </div>
</div>
```

**Step 2: Update the `FY25 Level *` label to just `Level *`** (approx line 451).

**Step 3: Update header `FY25 Data` to `FY26 Benchmark` (approx line 315)**

**Step 4: Do not commit yet.**

---

### Task B4: Update results JSX + add "Looking ahead" callout

**File:** `src/components/DeloitteSalaryAnalyzer.jsx` — the results section (approx lines 760–1030)

**Step 1: Update stat card labels**

Replace `FY25 Base`, `FY25 AIP`, `FY25 Total Comp` with `Current Base`, `AIP`, `Total Comp`. Replace references to `analysis.fy25Sal` → `analysis.currentSal`, `analysis.fy25Aip` → `analysis.currentAip`, `analysis.fy25Tc` → `analysis.currentTc`.

**Step 2: Remove the FY26 projection card block**

Delete the block starting at `{!analysis.fy26Sal && (` (approx lines 792–805).

**Step 3: Replace the "Your Rating in Context" section**

Delete the block guarded by `{analysis.ratingRaiseData && (` (approx lines 915–960) and any trailing rating-raise table.

Insert in its place:
```jsx
<div className="mb-6 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
  <div className="text-[10px] font-semibold text-violet-500 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
    Looking Ahead — FY27 Raise Context
  </div>
  <p className="text-sm text-stone-600 leading-relaxed">
    Deloitte changed the rating system this cycle, so we can't project your FY27 raise from your new rating. For reference, last year's FY25→FY26 data shows:
  </p>
  <ul className="mt-3 space-y-1.5 text-sm text-stone-700">
    <li>• Overall median raise (same-level): <span className="font-mono font-semibold">{(NON_PROMOTION_RAISE.median * 100).toFixed(1)}%</span> (n={NON_PROMOTION_RAISE.n})</li>
    {Object.entries(PROMOTION_RAISES).map(([lvl, d]) => (
      <li key={lvl}>• Promotion {d.fromLabel} → {d.toLabel}: <span className="font-mono font-semibold">{(d.median * 100).toFixed(1)}%</span> (n={d.n})</li>
    ))}
  </ul>
  <p className="mt-3 text-[12px] text-stone-400">FY27 survey expected June/July 2026.</p>
</div>
```

**Step 4: Update raise-vs-peers section**

If there's an existing `analysis.raiseRate` conditional render (approx lines 860–870), replace with a clean version using `analysis.raiseContext`:

```jsx
{analysis.raiseContext && (
  <div className="mb-6 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/60 shadow-sm">
    <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.12em] mb-3">Your Raise vs Peers</div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold font-mono text-stone-900">{(analysis.raiseContext.userPct * 100).toFixed(1)}%</span>
      <span className="text-stone-400 text-sm">your raise</span>
    </div>
    <p className="mt-2 text-sm text-stone-600">
      Peer median (same-level): <span className="font-mono font-semibold">{(analysis.raiseContext.peerMedian * 100).toFixed(1)}%</span>
      {" "}(P25 {(analysis.raiseContext.peerP25 * 100).toFixed(1)}% · P75 {(analysis.raiseContext.peerP75 * 100).toFixed(1)}%, n={analysis.raiseContext.peerN})
    </p>
    <p className="mt-1 text-[12px] text-stone-400">
      {analysis.raiseContext.vsOverall >= 0 ? "+" : ""}{(analysis.raiseContext.vsOverall * 100).toFixed(1)}pp vs peer median
    </p>
  </div>
)}
```

**Step 5: Sweep remaining `fy25`/`fy26` references**

```bash
grep -nE "fy25|fy26|FY25|FY26" src/components/DeloitteSalaryAnalyzer.jsx
```
Resolve each hit:
- Label strings → "Current" / "FY26 Benchmark" as appropriate
- Variable references → `currentSal` / `currentAip` / `currentTc`
- Remove any remaining rating references

**Step 6: Verify the build passes**

```bash
npm run build
```
Expected: clean build, no errors.

**Step 7: Verify in dev server**

```bash
npm run dev
```
In browser, test:
- Enter Level=Manager and Current Base=200000. Verify percentile shows against new FY26 peer data (should land near P75 or so).
- Add AIP, business, portfolio — verify filtered peer view shows.
- Enter Last Raise = 8 — verify "Your Raise vs Peers" shows 8.0%, peer median shows, delta computed.
- Verify "Looking Ahead" callout appears, with promotion raise list.
- Verify the old rating section and FY26 projection card are gone.
- Verify no console errors.

**Step 8: Commit Phase B**

```bash
git add src/components/DeloitteSalaryAnalyzer.jsx
git commit -m "feat(ui): single current-salary input, drop rating projections, add FY27 context callout"
```

---

### Task B5: Final sweep — remove dead imports and update header copy

**File:** `src/components/DeloitteSalaryAnalyzer.jsx`

**Step 1: Grep for dead references**

```bash
grep -nE "clientRating|consolidatedRating|ratingRaiseData|ratingLabel|projectedFy26|fy25|fy26" src/components/DeloitteSalaryAnalyzer.jsx
```
Expected: zero hits. Fix any remaining.

**Step 2: Clean import list**

Only keep these imports from `salaryData`:
```js
import {
  LEVEL_STATS, LEVELS, BUSINESSES, PORTFOLIOS, GPS_COMM,
  BUSINESS_MODELS, EDUCATION_LEVELS,
  GPS_COMMERCIAL_STATS, MBA_STATS, PORTFOLIO_STATS, BUSINESS_STATS, USDC_STATS,
  MBA_PREMIUM, PROMOTION_RAISES, NON_PROMOTION_RAISE, NEXT_LEVEL,
  totalRespondents,
} from "../data/salaryData";
```

**Step 3: Verify build + run dev server one more time**

```bash
npm run build && npm run dev
```

**Step 4: Commit if anything changed**

```bash
git add -p src/components/DeloitteSalaryAnalyzer.jsx
git commit -m "chore: remove dead rating/FY references"
```

---

## Out of scope

- New test framework (not in project today; single-day scope).
- FY27 survey ingestion (data doesn't exist until June/July 2026).
- Location / COLA adjustment (survey doesn't capture geography).
- Revamping the visual design.

## Rollback

All changes are in two commits (data regen + UI). `git revert` either or both cleanly restores the prior behavior.
