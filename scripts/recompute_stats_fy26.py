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


def main() -> None:
    raw = load_rows()
    rows = clean(raw)
    print(f"Raw: {len(raw)}  Clean: {len(rows)}", file=sys.stderr)
    assert 1500 <= len(rows) <= 1900, f"Unexpected clean row count: {len(rows)}"


if __name__ == "__main__":
    main()
