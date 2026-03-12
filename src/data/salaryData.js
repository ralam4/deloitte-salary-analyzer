// Stats recomputed from 2025 Deloitte Salary Survey Responses.xlsx (1,767 clean rows of 1,934 total)
// FY25 Global Business: Consulting + Advisory → "Consulting Services"

export const LEVEL_STATS = {
  "Analyst / Jr Staff": {
    count: 182,
    salary: { p10: 77050, p25: 85000, p50: 90000, p75: 94950, p90: 97180, mean: 88515 },
    aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
    tc: { p25: 85000, p50: 90000, p75: 94950 },
  },
  "Consultant / Staff": {
    count: 500,
    salary: { p10: 91800, p25: 96775, p50: 104000, p75: 111902, p90: 121330, mean: 103956 },
    aip: { p25: 5800, p50: 7800, p75: 12025, mean: 8768 },
    tc: { p25: 104500, p50: 112300, p75: 122100 },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    count: 490,
    salary: { p10: 115380, p25: 125600, p50: 138000, p75: 155000, p90: 175000, mean: 140413 },
    aip: { p25: 9525, p50: 13900, p75: 21150, mean: 15522 },
    tc: { p25: 138000, p50: 152700, p75: 175825 },
  },
  "Manager / Specialist Master": {
    count: 448,
    salary: { p10: 142300, p25: 160075, p50: 183200, p75: 199375, p90: 214720, mean: 180276 },
    aip: { p25: 16475, p50: 27550, p75: 40000, mean: 29194 },
    tc: { p25: 185000, p50: 211900, p75: 235625 },
  },
  "Senior Manager / Specialist Leader": {
    count: 147,
    salary: { p10: 185200, p25: 210200, p50: 225000, p75: 251400, p90: 265600, mean: 227406 },
    aip: { p25: 25050, p50: 40000, p75: 55000, mean: 43510 },
    tc: { p25: 242000, p50: 270300, p75: 300500 },
  },
};

export const GPS_COMMERCIAL_STATS = {
  "Analyst / Jr Staff": {
    GPS: {
      count: 79,
      salary: { p10: 71660, p25: 82650, p50: 88000, p75: 91050, p90: 96740, mean: 86387 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 82650, p50: 88000, p75: 91050 },
    },
    Commercial: {
      count: 98,
      salary: { p10: 83680, p25: 88125, p50: 92200, p75: 96700, p90: 97600, mean: 91323 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 88125, p50: 92200, p75: 96700 },
    },
  },
  "Consultant / Staff": {
    GPS: {
      count: 239,
      salary: { p10: 90980, p25: 96350, p50: 101000, p75: 107800, p90: 113140, mean: 101831 },
      aip: { p25: 5450, p50: 7300, p75: 11050, mean: 8348 },
      tc: { p25: 103400, p50: 110100, p75: 117850 },
    },
    Commercial: {
      count: 255,
      salary: { p10: 94700, p25: 97950, p50: 107100, p75: 115000, p90: 127760, mean: 106932 },
      aip: { p25: 6000, p50: 8100, p75: 12800, mean: 9263 },
      tc: { p25: 105750, p50: 115600, p75: 126600 },
    },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    GPS: {
      count: 236,
      salary: { p10: 115050, p25: 120900, p50: 128900, p75: 139025, p90: 148280, mean: 131049 },
      aip: { p25: 8275, p50: 12150, p75: 17625, mean: 13608 },
      tc: { p25: 135000, p50: 143050, p75: 153500 },
    },
    Commercial: {
      count: 237,
      salary: { p10: 124620, p25: 138560, p50: 152500, p75: 172000, p90: 177800, mean: 152182 },
      aip: { p25: 12500, p50: 16900, p75: 24600, mean: 18005 },
      tc: { p25: 153500, p50: 170000, p75: 188800 },
    },
  },
  "Manager / Specialist Master": {
    GPS: {
      count: 138,
      salary: { p10: 142000, p25: 151078, p50: 161000, p75: 177825, p90: 192635, mean: 163947 },
      aip: { p25: 14875, p50: 23350, p75: 35450, mean: 25701 },
      tc: { p25: 169200, p50: 186950, p75: 205400 },
    },
    Commercial: {
      count: 288,
      salary: { p10: 162130, p25: 180475, p50: 193250, p75: 205075, p90: 219160, mean: 191113 },
      aip: { p25: 19000, p50: 32700, p75: 44425, mean: 32306 },
      tc: { p25: 204650, p50: 224400, p75: 245000 },
    },
  },
  "Senior Manager / Specialist Leader": {
    GPS: {
      count: 34,
      salary: { p10: 178500, p25: 198550, p50: 208950, p75: 222050, p90: 248900, mean: 209921 },
      aip: { p25: 18375, p50: 28850, p75: 46275, mean: 32779 },
      tc: { p25: 218700, p50: 239200, p75: 273250 },
    },
    Commercial: {
      count: 108,
      salary: { p10: 207380, p25: 215950, p50: 233658, p75: 255850, p90: 267670, mean: 234639 },
      aip: { p25: 32150, p50: 46300, p75: 57875, mean: 48097 },
      tc: { p25: 256150, p50: 276750, p75: 311475 },
    },
  },
};

// Full MBA vs Non-MBA stats (levels with sufficient n)
export const MBA_STATS = {
  "Consultant / Staff": {
    MBA: {
      count: 23,
      salary: { p10: 71480, p25: 91400, p50: 96500, p75: 99850, p90: 116720, mean: 92082 },
      aip: { p25: 4850, p50: 6900, p75: 9500, mean: 6956 },
      tc: { p25: 98050, p50: 103800, p75: 109800 },
    },
    NonMBA: {
      count: 477,
      salary: { p10: 92000, p25: 97000, p50: 104400, p75: 112000, p90: 121420, mean: 104528 },
      aip: { p25: 5900, p50: 7800, p75: 12300, mean: 8855 },
      tc: { p25: 104900, p50: 112600, p75: 122200 },
    },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    MBA: {
      count: 81,
      salary: { p10: 127300, p25: 135500, p50: 159000, p75: 175000, p90: 177800, mean: 155233 },
      aip: { p25: 9800, p50: 13800, p75: 19500, mean: 15559 },
      tc: { p25: 151000, p50: 180000, p75: 188800 },
    },
    NonMBA: {
      count: 409,
      salary: { p10: 115080, p25: 123600, p50: 135380, p75: 149000, p90: 167640, mean: 137478 },
      aip: { p25: 9500, p50: 14000, p75: 21200, mean: 15514 },
      tc: { p25: 137100, p50: 150900, p75: 169800 },
    },
  },
  "Manager / Specialist Master": {
    MBA: {
      count: 126,
      salary: { p10: 156950, p25: 178025, p50: 195350, p75: 208050, p90: 223050, mean: 193473 },
      aip: { p25: 17562, p50: 32050, p75: 47000, mean: 32904 },
      tc: { p25: 200800, p50: 228750, p75: 252625 },
    },
    NonMBA: {
      count: 322,
      salary: { p10: 140000, p25: 155600, p50: 180000, p75: 195075, p90: 207980, mean: 175112 },
      aip: { p25: 16000, p50: 25000, p75: 37475, mean: 27743 },
      tc: { p25: 177625, p50: 205300, p75: 227200 },
    },
  },
  "Senior Manager / Specialist Leader": {
    MBA: {
      count: 50,
      salary: { p10: 200000, p25: 211600, p50: 227250, p75: 247725, p90: 273390, mean: 231177 },
      aip: { p25: 31150, p50: 46300, p75: 59125, mean: 48588 },
      tc: { p25: 245525, p50: 275400, p75: 316125 },
    },
    NonMBA: {
      count: 97,
      salary: { p10: 180480, p25: 209700, p50: 225000, p75: 252000, p90: 261720, mean: 225462 },
      aip: { p25: 21700, p50: 38300, p75: 51200, mean: 40892 },
      tc: { p25: 238000, p50: 269600, p75: 296500 },
    },
  },
};

export const USDC_STATS = {
  "Analyst / Jr Staff": {
    USDC: { count: 17, salary: { p25: 70000, p50: 70700, p75: 76200 } },
    Core: { count: 165, salary: { p25: 86900, p50: 90200, p75: 95000 } },
  },
  "Consultant / Staff": {
    USDC: { count: 41, salary: { p25: 86000, p50: 96000, p75: 105000 } },
    Core: { count: 459, salary: { p25: 97500, p50: 104400, p75: 112200 } },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    USDC: { count: 31, salary: { p25: 110100, p50: 118000, p75: 132500 } },
    Core: { count: 459, salary: { p25: 126950, p50: 139400, p75: 157250 } },
  },
  "Manager / Specialist Master": {
    USDC: { count: 15, salary: { p25: 142500, p50: 153700, p75: 157250 } },
    Core: { count: 433, salary: { p25: 162000, p50: 185000, p75: 200000 } },
  },
};

export const CONSOLIDATED_RATING_RAISES = {
  EEE: { n: 415, median: 0.1052, p25: 0.0748, p75: 0.1319 },
  EES: { n: 216, median: 0.0904, p25: 0.0602, p75: 0.1253 },
  ESE: { n: 191, median: 0.0852, p25: 0.0598, p75: 0.1123 },
  ESS: { n: 254, median: 0.0744, p25: 0.0486, p75: 0.108 },
  SSE: { n: 93, median: 0.0544, p25: 0.0457, p75: 0.071 },
  SES: { n: 70, median: 0.0461, p25: 0.0357, p75: 0.0578 },
  SSS: { n: 230, median: 0.035, p25: 0.0298, p75: 0.0448 },
};

export const CLIENT_RATING_RAISES = {
  Exceptional: { n: 1144, median: 0.0901, p25: 0.0602, p75: 0.121 },
  Strong: { n: 536, median: 0.0442, p25: 0.0327, p75: 0.0599 },
  "Meets Expectations": { n: 78, median: 0.0345, p25: 0.0268, p75: 0.0425 },
};

export const MBA_PREMIUM = {
  "Consultant / Staff": {
    mba: { n: 23, median: 96500 },
    bachelors: { n: 368, median: 104400 },
    delta: -7900,
    deltaPct: -0.076,
  },
  "Senior Consultant / Specialist Senior / Senior": {
    mba: { n: 81, median: 159000 },
    bachelors: { n: 265, median: 136000 },
    delta: 23000,
    deltaPct: 0.169,
  },
  "Manager / Specialist Master": {
    mba: { n: 126, median: 195350 },
    bachelors: { n: 186, median: 180000 },
    delta: 15350,
    deltaPct: 0.085,
  },
  "Senior Manager / Specialist Leader": {
    mba: { n: 50, median: 227250 },
    bachelors: { n: 57, median: 229300 },
    delta: -2050,
    deltaPct: -0.009,
  },
};

// "Promoted to X" = people whose FY26 level is X and FY25 level was the level below
export const PROMOTION_RAISES = {
  "Consultant / Staff": { n: 96, median: 0.0992, fromLabel: "Analyst", toLabel: "Consultant" },
  "Senior Consultant / Specialist Senior / Senior": { n: 204, median: 0.1375, fromLabel: "Consultant", toLabel: "Senior Consultant" },
  "Manager / Specialist Master": { n: 124, median: 0.1529, fromLabel: "Senior Consultant", toLabel: "Manager" },
  "Senior Manager / Specialist Leader": { n: 55, median: 0.0955, fromLabel: "Manager", toLabel: "Senior Manager" },
};
export const NON_PROMOTION_RAISE = { n: 1277, median: 0.0556, p25: 0.0368, p75: 0.0762 };

// Map each level to the next level key (for "what's my promo raise going to look like")
export const NEXT_LEVEL = {
  "Analyst / Jr Staff": "Consultant / Staff",
  "Consultant / Staff": "Senior Consultant / Specialist Senior / Senior",
  "Senior Consultant / Specialist Senior / Senior": "Manager / Specialist Master",
  "Manager / Specialist Master": "Senior Manager / Specialist Leader",
};

export const YEARS_AT_LEVEL_MANAGER = {
  1: { n: 118, median: 171300 },
  2: { n: 91, median: 180500 },
  3: { n: 132, median: 189100 },
  4: { n: 68, median: 196250 },
  5: { n: 16, median: 199500 },
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
];
export const GPS_COMM = ["Commercial", "GPS"];
export const CLIENT_RATINGS = ["Exceptional", "Strong", "Meets Expectations"];
export const CONSOLIDATED_RATINGS = ["EEE", "EES", "ESE", "ESS", "SSE", "SES", "SSS"];
export const EDUCATION_LEVELS = ["Bachelor's", "Non-MBA Master's", "MBA", "PhD / Other"];
export const BUSINESS_MODELS = ["Core (Traditional)", "USDC"];

// Business-type stats by level (Consulting Services = Consulting + Advisory merged)
export const BUSINESS_STATS = {
  "Analyst / Jr Staff": {
    "Consulting Services": {
      count: 176,
      salary: { p10: 80150, p25: 85075, p50: 90000, p75: 95000, p90: 97200, mean: 89200 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 85075, p50: 90000, p75: 95000 },
    },
  },
  "Consultant / Staff": {
    "Consulting Services": {
      count: 490,
      salary: { p10: 92000, p25: 97000, p50: 104400, p75: 112000, p90: 121610, mean: 104697 },
      aip: { p25: 6000, p50: 7800, p75: 12250, mean: 8890 },
      tc: { p25: 104650, p50: 112450, p75: 122100 },
    },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "Consulting Services": {
      count: 469,
      salary: { p10: 117660, p25: 126500, p50: 139100, p75: 156800, p90: 175000, mean: 141638 },
      aip: { p25: 10000, p50: 14600, p75: 21700, mean: 15904 },
      tc: { p25: 139100, p50: 153500, p75: 177800 },
    },
    "Enabling Areas": {
      count: 12,
      salary: { p10: 97380, p25: 113325, p50: 130000, p75: 134850, p90: 139920, mean: 123783 },
      aip: { p25: 4975, p50: 7500, p75: 9850, mean: 7792 },
      tc: { p25: 117950, p50: 138000, p75: 144250 },
    },
  },
  "Manager / Specialist Master": {
    "Consulting Services": {
      count: 417,
      salary: { p10: 148340, p25: 165500, p50: 186000, p75: 200000, p90: 216000, mean: 183053 },
      aip: { p25: 18700, p50: 30000, p75: 41000, mean: 30505 },
      tc: { p25: 189600, p50: 214500, p75: 237800 },
    },
    "Enabling Areas": {
      count: 22,
      salary: { p10: 119100, p25: 125500, p50: 135150, p75: 145570, p90: 177430, mean: 140786 },
      aip: { p25: 5200, p50: 9100, p75: 13650, mean: 11332 },
      tc: { p25: 136375, p50: 141150, p75: 155925 },
    },
  },
  "Senior Manager / Specialist Leader": {
    "Consulting Services": {
      count: 142,
      salary: { p10: 194160, p25: 211125, p50: 225650, p75: 251950, p90: 266350, mean: 228720 },
      aip: { p25: 25325, p50: 41000, p75: 55300, mean: 44429 },
      tc: { p25: 242125, p50: 272750, p75: 301675 },
    },
  },
};

// Offering Portfolio stats by level (FY26 portfolio names, n>=30 only)
export const PORTFOLIO_STATS = {
  "Analyst / Jr Staff": {
    "AI & Engineering": {
      count: 32,
      salary: { p10: 76280, p25: 89250, p50: 91300, p75: 93550, p90: 96510, mean: 88631 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 89250, p50: 91300, p75: 93550 },
    },
    "Customer": {
      count: 31,
      salary: { p10: 86620, p25: 89000, p50: 93700, p75: 96950, p90: 99000, mean: 93126 },
      aip: { p25: 0, p50: 0, p75: 0, mean: 0 },
      tc: { p25: 89000, p50: 93700, p75: 96950 },
    },
  },
  "Consultant / Staff": {
    "AI & Engineering": {
      count: 110,
      salary: { p10: 96000, p25: 101900, p50: 107450, p75: 114000, p90: 125000, mean: 108663 },
      aip: { p25: 6200, p50: 8400, p75: 14100, mean: 9941 },
      tc: { p25: 109625, p50: 117800, p75: 124475 },
    },
    "Strategy & Transactions": {
      count: 75,
      salary: { p10: 91880, p25: 97950, p50: 103100, p75: 109750, p90: 114960, mean: 102729 },
      aip: { p25: 6200, p50: 8000, p75: 10800, mean: 8696 },
      tc: { p25: 105000, p50: 112000, p75: 118350 },
    },
    "Customer": {
      count: 60,
      salary: { p10: 97790, p25: 101075, p50: 109750, p75: 115000, p90: 120595, mean: 109137 },
      aip: { p25: 6775, p50: 8000, p75: 13125, mean: 9395 },
      tc: { p25: 109175, p50: 120100, p75: 126125 },
    },
    "Human Capital": {
      count: 79,
      salary: { p10: 92080, p25: 96100, p50: 103200, p75: 114850, p90: 123760, mean: 105362 },
      aip: { p25: 6600, p50: 7500, p75: 12650, mean: 9081 },
      tc: { p25: 104650, p50: 113200, p75: 125050 },
    },
    "Enterprise Performance": {
      count: 67,
      salary: { p10: 94760, p25: 96850, p50: 105000, p75: 113550, p90: 126820, mean: 107212 },
      aip: { p25: 6650, p50: 7800, p75: 10950, mean: 8730 },
      tc: { p25: 104750, p50: 114900, p75: 123650 },
    },
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "AI & Engineering": {
      count: 112,
      salary: { p10: 123610, p25: 129575, p50: 139700, p75: 159500, p90: 172990, mean: 144531 },
      aip: { p25: 10775, p50: 15750, p75: 22000, mean: 16399 },
      tc: { p25: 144025, p50: 157000, p75: 181050 },
    },
    "Strategy & Transactions": {
      count: 72,
      salary: { p10: 120810, p25: 127225, p50: 143750, p75: 175000, p90: 177980, mean: 148047 },
      aip: { p25: 9675, p50: 16050, p75: 23125, mean: 16494 },
      tc: { p25: 146075, p50: 158500, p75: 188800 },
    },
    "Customer": {
      count: 63,
      salary: { p10: 130000, p25: 133650, p50: 145000, p75: 166750, p90: 175000, mean: 149936 },
      aip: { p25: 12545, p50: 16900, p75: 23700, mean: 17760 },
      tc: { p25: 146250, p50: 164300, p75: 187545 },
    },
    "Human Capital": {
      count: 64,
      salary: { p10: 114120, p25: 121650, p50: 131460, p75: 151975, p90: 170700, mean: 137383 },
      aip: { p25: 10225, p50: 15950, p75: 22725, mean: 16451 },
      tc: { p25: 136050, p50: 151100, p75: 170144 },
    },
    "Enterprise Performance": {
      count: 50,
      salary: { p10: 120620, p25: 129000, p50: 140200, p75: 149750, p90: 159600, mean: 138607 },
      aip: { p25: 11500, p50: 13800, p75: 20125, mean: 15740 },
      tc: { p25: 141250, p50: 155300, p75: 168450 },
    },
    "Cyber": {
      count: 30,
      salary: { p10: 109800, p25: 114300, p50: 122550, p75: 133025, p90: 153510, mean: 127238 },
      aip: { p25: 7675, p50: 10900, p75: 16900, mean: 12502 },
      tc: { p25: 124100, p50: 136200, p75: 152525 },
    },
    "Other": {
      count: 41,
      salary: { p10: 96200, p25: 114000, p50: 121000, p75: 137400, p90: 147500, mean: 124720 },
      aip: { p25: 6500, p50: 11600, p75: 16500, mean: 11847 },
      tc: { p25: 118500, p50: 137600, p75: 151600 },
    },
  },
  "Manager / Specialist Master": {
    "AI & Engineering": {
      count: 89,
      salary: { p10: 154080, p25: 172000, p50: 189400, p75: 202000, p90: 213040, mean: 185275 },
      aip: { p25: 15800, p50: 25200, p75: 38900, mean: 29450 },
      tc: { p25: 192500, p50: 217000, p75: 239800 },
    },
    "Strategy & Transactions": {
      count: 72,
      salary: { p10: 150250, p25: 170350, p50: 194200, p75: 217375, p90: 229820, mean: 192240 },
      aip: { p25: 19000, p50: 32900, p75: 45825, mean: 35348 },
      tc: { p25: 193650, p50: 230425, p75: 256125 },
    },
    "Customer": {
      count: 62,
      salary: { p10: 147390, p25: 168000, p50: 188500, p75: 198450, p90: 209420, mean: 183658 },
      aip: { p25: 22700, p50: 30750, p75: 37800, mean: 31339 },
      tc: { p25: 196775, p50: 217200, p75: 236425 },
    },
    "Human Capital": {
      count: 55,
      salary: { p10: 154380, p25: 165150, p50: 180200, p75: 196300, p90: 207220, mean: 180613 },
      aip: { p25: 19750, p50: 29800, p75: 36900, mean: 29569 },
      tc: { p25: 193150, p50: 207200, p75: 226950 },
    },
    "Enterprise Performance": {
      count: 54,
      salary: { p10: 164830, p25: 175250, p50: 185000, p75: 197900, p90: 205210, mean: 184079 },
      aip: { p25: 21075, p50: 33700, p75: 42500, mean: 30925 },
      tc: { p25: 198475, p50: 219300, p75: 232362 },
    },
    "Cyber": {
      count: 30,
      salary: { p10: 144500, p25: 154000, p50: 168500, p75: 185925, p90: 200150, mean: 171298 },
      aip: { p25: 17475, p50: 24200, p75: 35250, mean: 25963 },
      tc: { p25: 179078, p50: 191900, p75: 219650 },
    },
    "Other": {
      count: 39,
      salary: { p10: 118200, p25: 130000, p50: 142000, p75: 177250, p90: 200240, mean: 152367 },
      aip: { p25: 8050, p50: 12500, p75: 18750, mean: 15574 },
      tc: { p25: 138350, p50: 155500, p75: 198650 },
    },
  },
  "Senior Manager / Specialist Leader": {
    "AI & Engineering": {
      count: 32,
      salary: { p10: 203200, p25: 215225, p50: 236300, p75: 253850, p90: 268750, mean: 235300 },
      aip: { p25: 32325, p50: 46200, p75: 54350, mean: 44978 },
      tc: { p25: 259875, p50: 276750, p75: 306675 },
    },
  },
};

export const totalRespondents = Object.values(LEVEL_STATS).reduce((s, v) => s + v.count, 0);
