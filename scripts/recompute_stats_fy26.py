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
