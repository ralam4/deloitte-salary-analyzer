// Stats computed from 2025 Deloitte Salary Survey Responses.xlsx (1,775 clean rows of 1,934 total)

export const LEVEL_STATS = {
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

export const GPS_COMMERCIAL_STATS = {
  "Analyst / Jr Staff": {
    GPS: {
      count: 32,
      salary: { p10: 67750, p25: 82000, p50: 85000, p75: 88000, p90: 94600, mean: 83503 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 163 },
      tc: { p25: 82000, p50: 85000, p75: 88000 },
    },
    Commercial: {
      count: 45,
      salary: { p10: 90000, p25: 90000, p50: 91600, p75: 95000, p90: 96700, mean: 91921 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 90000, p50: 91600, p75: 95000 },
    },
  },
  "Consultant / Staff": {
    GPS: {
      count: 178,
      salary: { p10: 85070, p25: 90200, p50: 97250, p75: 104600, p90: 110090, mean: 97488 },
      aip: { p25: 0, p50: 4700, p75: 7700, mean: 5367 },
      tc: { p25: 93000, p50: 103100, p75: 111900 },
    },
    Commercial: {
      count: 208,
      salary: { p10: 88940, p25: 94800, p50: 100300, p75: 109000, p90: 115000, mean: 100848 },
      aip: { p25: 3600, p50: 6500, p75: 9450, mean: 6625 },
      tc: { p25: 98775, p50: 107700, p75: 118025 },
    },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    GPS: {
      count: 290,
      salary: { p10: 97980, p25: 106000, p50: 119800, p75: 130000, p90: 142030, mean: 119598 },
      aip: { p25: 7200, p50: 10550, p75: 13875, mean: 11117 },
      tc: { p25: 115300, p50: 131350, p75: 143450 },
    },
    Commercial: {
      count: 270,
      salary: { p10: 96990, p25: 116750, p50: 135400, p75: 155000, p90: 175000, mean: 135682 },
      aip: { p25: 9225, p50: 13450, p75: 17000, mean: 13839 },
      tc: { p25: 129600, p50: 151500, p75: 170000 },
    },
  },
  "Manager / Specialist Master": {
    GPS: {
      count: 180,
      salary: { p10: 128080, p25: 141225, p50: 154200, p75: 169650, p90: 182440, mean: 155160 },
      aip: { p25: 14700, p50: 21100, p75: 29650, mean: 23004 },
      tc: { p25: 159300, p50: 174550, p75: 193350 },
    },
    Commercial: {
      count: 312,
      salary: { p10: 145010, p25: 169225, p50: 186100, p75: 198925, p90: 212900, mean: 182101 },
      aip: { p25: 18250, p50: 26800, p75: 35925, mean: 28827 },
      tc: { p25: 192300, p50: 213200, p75: 232975 },
    },
  },
  "Senior Manager / Specialist Leader": {
    GPS: {
      count: 44,
      salary: { p10: 175860, p25: 186050, p50: 203000, p75: 217475, p90: 240100, mean: 204439 },
      aip: { p25: 20950, p50: 33000, p75: 47125, mean: 35227 },
      tc: { p25: 214300, p50: 237000, p75: 266750 },
    },
    Commercial: {
      count: 146,
      salary: { p10: 197000, p25: 212800, p50: 225350, p75: 249500, p90: 265750, mean: 229234 },
      aip: { p25: 35000, p50: 47000, p75: 55000, mean: 48110 },
      tc: { p25: 250562, p50: 273750, p75: 300750 },
    },
  },
};

export const USDC_STATS = {
  "Consultant / Staff": {
    USDC: { count: 34, salary: { p25: 79625, p50: 88600, p75: 100275 } },
    Core: { count: 341, salary: { p25: 94700, p50: 99600, p75: 107600 } },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    USDC: { count: 42, salary: { p25: 101250, p50: 110050, p75: 118775 } },
    Core: { count: 478, salary: { p25: 109650, p50: 125850, p75: 141700 } },
  },
  "Manager / Specialist Master": {
    USDC: { count: 19, salary: { p25: 137200, p50: 146300, p75: 156400 } },
    Core: { count: 414, salary: { p25: 151125, p50: 175400, p75: 192875 } },
  },
};

export const CONSOLIDATED_RATING_RAISES = {
  EEE: { n: 411, median: 0.1054, p25: 0.0748, p75: 0.1330 },
  EES: { n: 216, median: 0.0904, p25: 0.0602, p75: 0.1253 },
  ESE: { n: 190, median: 0.0853, p25: 0.0598, p75: 0.1124 },
  ESS: { n: 254, median: 0.0744, p25: 0.0486, p75: 0.1080 },
  SSE: { n: 93, median: 0.0544, p25: 0.0457, p75: 0.0710 },
  SES: { n: 70, median: 0.0461, p25: 0.0357, p75: 0.0578 },
  SSS: { n: 226, median: 0.0346, p25: 0.0297, p75: 0.0439 },
};

export const CLIENT_RATING_RAISES = {
  Exceptional: { n: 1136, median: 0.0903, p25: 0.0603, p75: 0.1213 },
  Strong: { n: 531, median: 0.0440, p25: 0.0327, p75: 0.0595 },
  "Meets Expectations": { n: 76, median: 0.0352, p25: 0.0269, p75: 0.0427 },
};

export const MBA_PREMIUM = {
  "Senior Consultant / Specialist Senior / Senior": {
    mba: { n: 75, median: 154000 },
    bachelors: { n: 351, median: 121700 },
    delta: 32300,
    deltaPct: 0.265,
  },
  "Manager / Specialist Master": {
    mba: { n: 129, median: 191000 },
    bachelors: { n: 229, median: 169600 },
    delta: 21400,
    deltaPct: 0.126,
  },
  "Senior Manager / Specialist Leader": {
    mba: { n: 63, median: 223200 },
    bachelors: { n: 74, median: 220000 },
    delta: 3200,
    deltaPct: 0.015,
  },
};

export const PROMOTION_RAISES = {
  "Consultant / Staff": { n: 97, median: 0.0993 },
  "Senior Consultant / Specialist Senior / Senior": { n: 210, median: 0.1375 },
  "Manager / Specialist Master": { n: 122, median: 0.1510 },
  "Senior Manager / Specialist Leader": { n: 52, median: 0.0971 },
};
export const NON_PROMOTION_RAISE = { n: 1269, median: 0.0560, p25: 0.0375, p75: 0.0762 };

export const YEARS_AT_LEVEL_MANAGER = {
  1: { n: 119, median: 168300 },
  2: { n: 114, median: 175500 },
  3: { n: 168, median: 176400 },
  4: { n: 69, median: 174300 },
  5: { n: 15, median: 198000 },
};

export const LEVELS = Object.keys(LEVEL_STATS);
export const BUSINESSES = ["Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"];
export const PORTFOLIOS = [
  "AI & Engineering",
  "Strategy & Transactions",
  "Customer",
  "Human Capital",
  "Enterprise Performance",
  "Cyber",
  "Finance Transformation",
  "Regulatory, Risk & Forensic",
  "Other",
  "Enabling Areas",
];
export const GPS_COMM = ["Commercial", "GPS"];
export const CLIENT_RATINGS = ["Exceptional", "Strong", "Meets Expectations"];
export const CONSOLIDATED_RATINGS = ["EEE", "EES", "ESE", "ESS", "SSE", "SES", "SSS"];
export const EDUCATION_LEVELS = ["Bachelor's", "Non-MBA Master's", "MBA", "PhD / Other"];
export const BUSINESS_MODELS = ["Core (Traditional)", "USDC"];

export const totalRespondents = Object.values(LEVEL_STATS).reduce((s, v) => s + v.count, 0);
