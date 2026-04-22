# Salary Analyzer FY26 Refresh — Design

Date: 2026-04-21

## Problem

Two user-reported issues with the current tool:

1. **FY labeling is confusing.** Input asks for "FY25 salary" (required) and "FY26 salary" (optional). Today is April 2026 — users interpret "FY26" as a future year they don't have yet, and the two-salary model adds friction. Deloitte's FY runs June–May, so FY26 (June 2025 – May 2026) is actually *now*, but the labeling doesn't communicate that.
2. **Rating system changed for the FY27 cycle.** The tool currently asks for FY25 Client Rating and Consolidated Rating (EEE/ESS/…) and projects an FY26 raise from peer rating data. Since Deloitte replaced the rating system, users' new ratings no longer map to the survey's rating cohorts. Rating-based projections are broken.

Additionally: benchmarks are computed against the FY25 salary column from the 2025 survey, so a user entering their *current* salary (which is their post-June-2025 FY26 base) gets compared to year-old peer data — skewing them ~7% high for no real reason.

## Goals

- Input asks for one salary (current), with no FY terminology.
- Benchmarks compare against FY26 salary peer data (same survey, different column).
- Rating-based projections removed; rating system change acknowledged to the user.
- Still-valid raise context (overall median, promotion raises by level) preserved.
- USDC, MBA, portfolio, business, and GPS/Commercial breakdowns preserved.

## Non-goals

- FY27 survey data (not available until June/July 2026).
- Location/COLA adjustment (not in survey data).
- Migration to a new rating system (would require a new survey).

## Input form — final shape

**Required**
- Current base salary
- Level (Analyst / Consultant / Senior / Manager / Senior Manager)

**Optional (refines benchmark or adds context)**
- Business — Consulting Services / A&A / Tax / Enabling Areas
- GPS or Commercial
- Offering Portfolio
- Talent Model — Core / USDC
- AIP received
- Education — Bachelor's / Master's / MBA / PhD
- Last raise % (June 2025 bump) — enables raise-vs-peers section

**Removed**
- FY25 salary and FY26 salary fields (collapsed to one `currentSalary`)
- Client Rating dropdown
- Consolidated Rating dropdown

## Output sections — final order

1. **Snapshot cards** — Current base, AIP, Total comp.
2. **Where you stand** — primary percentile bar against FY26 peer benchmark. Header clearly labeled *"FY26 peer data · 2025 survey · n=…"*.
3. **Filtered peer view** — narrower slice if business/portfolio/GPS-comm selected; `n<30` warning preserved.
4. **Your last raise vs peers** — only if user entered raise %. Shows their raise in the peer raise distribution. If level changed FY25→FY26, compares against the promotion cohort for the new level.
5. **Looking ahead** (new callout, replaces rating projection):
   > Deloitte changed the rating system this cycle, so we can't project your FY27 raise from your new rating. For context: last year's overall median raise was ~7%, and promotion-year raises by level ranged 10–15%. FY27 survey expected June/July 2026.
6. **USDC vs Core**
7. **MBA premium**
8. **Years at level** (Manager only)

**Removed sections:** "Your Rating in Context" (rating-based projection table), the FY26 projection card.

## Data layer

**Regenerated** (recompute against `FY26 Base Salary (USD)` column in the 2025 XLSX):
- `LEVEL_STATS`
- `BUSINESS_STATS`
- `GPS_COMMERCIAL_STATS`
- `PORTFOLIO_STATS`
- `USDC_STATS`
- `MBA_STATS`
- `MBA_PREMIUM`
- `YEARS_AT_LEVEL_MANAGER`

**Kept as-is** (FY25→FY26 percent changes, still valid):
- `PROMOTION_RAISES`
- `NON_PROMOTION_RAISE`

**Deleted:**
- `CONSOLIDATED_RATING_RAISES`
- `CLIENT_RATING_RAISES`
- `CONSOLIDATED_RATINGS` constant
- `CLIENT_RATINGS` constant

## Implementation approach

- **One-time Python script** at `scripts/recompute_stats_fy26.py` that reads the XLSX and writes `src/data/salaryData.js`. Same export shape as today; only the underlying numbers change. Committed so re-runs are reproducible. Uses `openpyxl` + `numpy`.
- **UI edits in `src/components/DeloitteSalaryAnalyzer.jsx`:**
  - Collapse `fy25Salary` + `fy26Salary` form state to `currentSalary`.
  - Add optional `lastRaisePct` field.
  - Remove rating form state, rating `useMemo` branch, rating JSX block, FY26 projection card.
  - Copy edits: "FY25 Base" → "Current Base," header "FY25 Data" → "FY26 Benchmark — 2025 Survey," etc.
- **Scope:** ~1 day. Script ~150 lines. UI changes mostly deletions + renames (net negative LOC).

## Open questions

None at design time. Revisit when FY27 survey arrives (June/July 2026).
