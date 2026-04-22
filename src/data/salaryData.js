// Stats recomputed from 2025 Deloitte Salary Survey Responses.xlsx
// Base salary benchmarks are computed against the FY26 Base Salary column
// (respondents' post-June-2025 salaries).
// Raise stats are FY25->FY26 percent change.
// Regenerate with: python3 scripts/recompute_stats_fy26.py

export const LEVEL_STATS = {
  "Analyst / Jr Staff": {
    "count": 80,
    "salary": {
      "p25": 87775,
      "p50": 94000,
      "p75": 99075,
      "mean": 91228,
      "p10": 73470,
      "p90": 102500
    },
    "aip": {
      "p25": 4900,
      "p50": 4900,
      "p75": 4900,
      "mean": 4900
    },
    "tc": {
      "p25": 87775,
      "p50": 94000,
      "p75": 99075
    }
  },
  "Consultant / Staff": {
    "count": 391,
    "salary": {
      "p25": 99600,
      "p50": 106300,
      "p75": 115400,
      "mean": 107428,
      "p10": 93500,
      "p90": 121200
    },
    "aip": {
      "p25": 4800,
      "p50": 7000,
      "p75": 10200,
      "mean": 7823
    },
    "tc": {
      "p25": 102850,
      "p50": 112200,
      "p75": 123600
    }
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "count": 577,
    "salary": {
      "p25": 121000,
      "p50": 137000,
      "p75": 151800,
      "mean": 138238,
      "p10": 113560,
      "p90": 175940
    },
    "aip": {
      "p25": 8000,
      "p50": 12000,
      "p75": 15900,
      "mean": 12566
    },
    "tc": {
      "p25": 131500,
      "p50": 148780,
      "p75": 166200
    }
  },
  "Manager / Specialist Master": {
    "count": 515,
    "salary": {
      "p25": 162900,
      "p50": 186500,
      "p75": 204000,
      "mean": 182712,
      "p10": 147900,
      "p90": 215460
    },
    "aip": {
      "p25": 16275,
      "p50": 24050,
      "p75": 33525,
      "mean": 26106
    },
    "tc": {
      "p25": 183500,
      "p50": 209100,
      "p75": 234750
    }
  },
  "Senior Manager / Specialist Leader": {
    "count": 202,
    "salary": {
      "p25": 216050,
      "p50": 232750,
      "p75": 254300,
      "mean": 231234,
      "p10": 186910,
      "p90": 271870
    },
    "aip": {
      "p25": 27250,
      "p50": 44200,
      "p75": 53475,
      "mean": 43278
    },
    "tc": {
      "p25": 248250,
      "p50": 276500,
      "p75": 303725
    }
  }
};

export const GPS_COMMERCIAL_STATS = {
  "Analyst / Jr Staff": {
    "GPS": {
      "count": 32,
      "salary": {
        "p25": 84700,
        "p50": 88000,
        "p75": 92025,
        "mean": 87611,
        "p10": 72870,
        "p90": 96925
      },
      "aip": {
        "p25": 4900,
        "p50": 4900,
        "p75": 4900,
        "mean": 4900
      },
      "tc": {
        "p25": 84700,
        "p50": 88000,
        "p75": 92025
      }
    },
    "Commercial": {
      "count": 45,
      "salary": {
        "p25": 94300,
        "p50": 98200,
        "p75": 100800,
        "mean": 95351,
        "p10": 91300,
        "p90": 102560
      },
      "aip": {},
      "tc": {
        "p25": 94300,
        "p50": 98200,
        "p75": 100800
      }
    }
  },
  "Consultant / Staff": {
    "GPS": {
      "count": 177,
      "salary": {
        "p25": 97400,
        "p50": 103700,
        "p75": 110400,
        "mean": 103436,
        "p10": 92500,
        "p90": 116700
      },
      "aip": {
        "p25": 4450,
        "p50": 6600,
        "p75": 9600,
        "mean": 7311
      },
      "tc": {
        "p25": 99400,
        "p50": 108600,
        "p75": 118600
      }
    },
    "Commercial": {
      "count": 208,
      "salary": {
        "p25": 103400,
        "p50": 108850,
        "p75": 117100,
        "mean": 112067,
        "p10": 96350,
        "p90": 123500
      },
      "aip": {
        "p25": 5400,
        "p50": 7300,
        "p75": 10400,
        "mean": 8292
      },
      "tc": {
        "p25": 106700,
        "p50": 114700,
        "p75": 126400
      }
    }
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "GPS": {
      "count": 290,
      "salary": {
        "p25": 120700,
        "p50": 129150,
        "p75": 140000,
        "mean": 130283,
        "p10": 114800,
        "p90": 147830
      },
      "aip": {
        "p25": 7300,
        "p50": 10700,
        "p75": 13900,
        "mean": 11233
      },
      "tc": {
        "p25": 128800,
        "p50": 141450,
        "p75": 152000
      }
    },
    "Commercial": {
      "count": 271,
      "salary": {
        "p25": 133300,
        "p50": 149200,
        "p75": 165050,
        "mean": 148184,
        "p10": 110400,
        "p90": 185000
      },
      "aip": {
        "p25": 9700,
        "p50": 13500,
        "p75": 17300,
        "mean": 14316
      },
      "tc": {
        "p25": 145325,
        "p50": 161900,
        "p75": 183650
      }
    }
  },
  "Manager / Specialist Master": {
    "GPS": {
      "count": 182,
      "salary": {
        "p25": 154200,
        "p50": 165600,
        "p75": 178675,
        "mean": 166485,
        "p10": 145390,
        "p90": 192230
      },
      "aip": {
        "p25": 14775,
        "p50": 21100,
        "p75": 29650,
        "mean": 23115
      },
      "tc": {
        "p25": 171600,
        "p50": 187550,
        "p75": 204700
      }
    },
    "Commercial": {
      "count": 313,
      "salary": {
        "p25": 183000,
        "p50": 198275,
        "p75": 210000,
        "mean": 194370,
        "p10": 163280,
        "p90": 222940
      },
      "aip": {
        "p25": 18250,
        "p50": 26800,
        "p75": 35925,
        "mean": 28856
      },
      "tc": {
        "p25": 203900,
        "p50": 225900,
        "p75": 243400
      }
    }
  },
  "Senior Manager / Specialist Leader": {
    "GPS": {
      "count": 44,
      "salary": {
        "p25": 200400,
        "p50": 215650,
        "p75": 225700,
        "mean": 211505,
        "p10": 184530,
        "p90": 250290
      },
      "aip": {
        "p25": 20950,
        "p50": 33000,
        "p75": 47125,
        "mean": 35227
      },
      "tc": {
        "p25": 230950,
        "p50": 247100,
        "p75": 280225
      }
    },
    "Commercial": {
      "count": 148,
      "salary": {
        "p25": 222900,
        "p50": 241400,
        "p75": 261025,
        "mean": 241319,
        "p10": 208400,
        "p90": 276810
      },
      "aip": {
        "p25": 34675,
        "p50": 46900,
        "p75": 55000,
        "mean": 47662
      },
      "tc": {
        "p25": 261900,
        "p50": 287050,
        "p75": 313825
      }
    }
  }
};

export const BUSINESS_STATS = {
  "Analyst / Jr Staff": {
    "Consulting Services": {
      "count": 76,
      "salary": {
        "p25": 87800,
        "p50": 94150,
        "p75": 99350,
        "mean": 92141,
        "p10": 77200,
        "p90": 102500
      },
      "aip": {
        "p25": 4900,
        "p50": 4900,
        "p75": 4900,
        "mean": 4900
      },
      "tc": {
        "p25": 87800,
        "p50": 94150,
        "p75": 99350
      }
    }
  },
  "Consultant / Staff": {
    "Consulting Services": {
      "count": 382,
      "salary": {
        "p25": 99825,
        "p50": 106550,
        "p75": 115600,
        "mean": 108418,
        "p10": 94520,
        "p90": 121200
      },
      "aip": {
        "p25": 4800,
        "p50": 7000,
        "p75": 10300,
        "mean": 7899
      },
      "tc": {
        "p25": 103350,
        "p50": 112600,
        "p75": 123600
      }
    }
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "Consulting Services": {
      "count": 528,
      "salary": {
        "p25": 124950,
        "p50": 138900,
        "p75": 153000,
        "mean": 140828,
        "p10": 115240,
        "p90": 177150
      },
      "aip": {
        "p25": 8450,
        "p50": 12300,
        "p75": 16150,
        "mean": 12955
      },
      "tc": {
        "p25": 134100,
        "p50": 151150,
        "p75": 168625
      }
    },
    "Audit & Assurance": {
      "count": 36,
      "salary": {
        "p25": 100800,
        "p50": 104950,
        "p75": 116500,
        "mean": 108654,
        "p10": 97100,
        "p90": 124600
      },
      "aip": {
        "p25": 4900,
        "p50": 6000,
        "p75": 10000,
        "mean": 7830
      },
      "tc": {
        "p25": 102340,
        "p50": 112800,
        "p75": 126850
      }
    }
  },
  "Manager / Specialist Master": {
    "Consulting Services": {
      "count": 484,
      "salary": {
        "p25": 167375,
        "p50": 188850,
        "p75": 204490,
        "mean": 185652,
        "p10": 153760,
        "p90": 215600
      },
      "aip": {
        "p25": 17400,
        "p50": 25000,
        "p75": 34000,
        "mean": 27110
      },
      "tc": {
        "p25": 188700,
        "p50": 212950,
        "p75": 235600
      }
    },
    "Enabling Areas": {
      "count": 17,
      "salary": {
        "p25": 125500,
        "p50": 135500,
        "p75": 150500,
        "mean": 132511,
        "p10": 121264,
        "p90": 154800
      },
      "aip": {
        "p25": 4600,
        "p50": 9000,
        "p75": 12000,
        "mean": 8982
      },
      "tc": {
        "p25": 135600,
        "p50": 143300,
        "p75": 160000
      }
    }
  },
  "Senior Manager / Specialist Leader": {
    "Consulting Services": {
      "count": 191,
      "salary": {
        "p25": 219850,
        "p50": 235000,
        "p75": 256500,
        "mean": 234573,
        "p10": 195600,
        "p90": 272000
      },
      "aip": {
        "p25": 30850,
        "p50": 45000,
        "p75": 54000,
        "mean": 44948
      },
      "tc": {
        "p25": 252000,
        "p50": 280900,
        "p75": 306500
      }
    }
  }
};

export const PORTFOLIO_STATS = {
  "Consultant / Staff": {
    "AI & Engineering": {
      "count": 78,
      "salary": {
        "p25": 105725,
        "p50": 110650,
        "p75": 116975,
        "mean": 110647,
        "p10": 98540,
        "p90": 120740
      },
      "aip": {
        "p25": 5000,
        "p50": 7900,
        "p75": 13000,
        "mean": 8742
      },
      "tc": {
        "p25": 109175,
        "p50": 119900,
        "p75": 127525
      }
    },
    "Strategy & Transactions": {
      "count": 54,
      "salary": {
        "p25": 97925,
        "p50": 105600,
        "p75": 111650,
        "mean": 99328,
        "p10": 93020,
        "p90": 115900
      },
      "aip": {
        "p25": 4700,
        "p50": 7000,
        "p75": 9100,
        "mean": 6872
      },
      "tc": {
        "p25": 102325,
        "p50": 108250,
        "p75": 118800
      }
    },
    "Customer": {
      "count": 66,
      "salary": {
        "p25": 105450,
        "p50": 110550,
        "p75": 120150,
        "mean": 111801,
        "p10": 100580,
        "p90": 123750
      },
      "aip": {
        "p25": 6500,
        "p50": 8000,
        "p75": 12550,
        "mean": 9473
      },
      "tc": {
        "p25": 107925,
        "p50": 114900,
        "p75": 130725
      }
    },
    "Human Capital": {
      "count": 48,
      "salary": {
        "p25": 102000,
        "p50": 107700,
        "p75": 116000,
        "mean": 108589,
        "p10": 95280,
        "p90": 125830
      },
      "aip": {
        "p25": 4875,
        "p50": 6750,
        "p75": 8700,
        "mean": 7616
      },
      "tc": {
        "p25": 107775,
        "p50": 116250,
        "p75": 122375
      }
    },
    "Enterprise Performance": {
      "count": 52,
      "salary": {
        "p25": 100975,
        "p50": 105850,
        "p75": 113200,
        "mean": 124569,
        "p10": 94820,
        "p90": 119420
      },
      "aip": {
        "p25": 4500,
        "p50": 7000,
        "p75": 9500,
        "mean": 8083
      },
      "tc": {
        "p25": 105250,
        "p50": 113150,
        "p75": 120350
      }
    }
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "AI & Engineering": {
      "count": 125,
      "salary": {
        "p25": 132600,
        "p50": 144700,
        "p75": 159400,
        "mean": 147082,
        "p10": 121100,
        "p90": 179160
      },
      "aip": {
        "p25": 8600,
        "p50": 12800,
        "p75": 16500,
        "mean": 13629
      },
      "tc": {
        "p25": 144500,
        "p50": 157000,
        "p75": 178300
      }
    },
    "Strategy & Transactions": {
      "count": 88,
      "salary": {
        "p25": 120900,
        "p50": 138650,
        "p75": 153175,
        "mean": 142233,
        "p10": 116680,
        "p90": 183400
      },
      "aip": {
        "p25": 9150,
        "p50": 12000,
        "p75": 16000,
        "mean": 13189
      },
      "tc": {
        "p25": 131750,
        "p50": 152200,
        "p75": 165375
      }
    },
    "Customer": {
      "count": 61,
      "salary": {
        "p25": 138100,
        "p50": 148000,
        "p75": 166000,
        "mean": 152110,
        "p10": 127000,
        "p90": 185000
      },
      "aip": {
        "p25": 10050,
        "p50": 13500,
        "p75": 17950,
        "mean": 14375
      },
      "tc": {
        "p25": 146500,
        "p50": 163600,
        "p75": 183600
      }
    },
    "Human Capital": {
      "count": 87,
      "salary": {
        "p25": 117800,
        "p50": 131900,
        "p75": 151400,
        "mean": 134059,
        "p10": 113860,
        "p90": 164800
      },
      "aip": {
        "p25": 7950,
        "p50": 11400,
        "p75": 16550,
        "mean": 12728
      },
      "tc": {
        "p25": 128162,
        "p50": 144700,
        "p75": 165100
      }
    },
    "Enterprise Performance": {
      "count": 64,
      "salary": {
        "p25": 127500,
        "p50": 140700,
        "p75": 150275,
        "mean": 138553,
        "p10": 118070,
        "p90": 157980
      },
      "aip": {
        "p25": 9000,
        "p50": 12650,
        "p75": 15525,
        "mean": 12924
      },
      "tc": {
        "p25": 140500,
        "p50": 153050,
        "p75": 165375
      }
    },
    "Cyber": {
      "count": 31,
      "salary": {
        "p25": 117250,
        "p50": 122700,
        "p75": 133750,
        "mean": 123132,
        "p10": 110300,
        "p90": 140500
      },
      "aip": {
        "p25": 6750,
        "p50": 10000,
        "p75": 10900,
        "mean": 9921
      },
      "tc": {
        "p25": 126800,
        "p50": 131800,
        "p75": 148250
      }
    },
    "Finance Transformation": {
      "count": 31,
      "salary": {
        "p25": 122450,
        "p50": 134700,
        "p75": 144650,
        "mean": 133903,
        "p10": 112700,
        "p90": 157000
      },
      "aip": {
        "p25": 7800,
        "p50": 11600,
        "p75": 15675,
        "mean": 12337
      },
      "tc": {
        "p25": 131875,
        "p50": 147000,
        "p75": 156950
      }
    },
    "Other": {
      "count": 55,
      "salary": {
        "p25": 101800,
        "p50": 120000,
        "p75": 138500,
        "mean": 121479,
        "p10": 98940,
        "p90": 147680
      },
      "aip": {
        "p25": 5600,
        "p50": 7500,
        "p75": 13000,
        "mean": 9879
      },
      "tc": {
        "p25": 106650,
        "p50": 126500,
        "p75": 152850
      }
    }
  },
  "Manager / Specialist Master": {
    "AI & Engineering": {
      "count": 100,
      "salary": {
        "p25": 169300,
        "p50": 191000,
        "p75": 203364,
        "mean": 187168,
        "p10": 156090,
        "p90": 215420
      },
      "aip": {
        "p25": 16600,
        "p50": 23800,
        "p75": 33250,
        "mean": 25913
      },
      "tc": {
        "p25": 190200,
        "p50": 213850,
        "p75": 235675
      }
    },
    "Strategy & Transactions": {
      "count": 81,
      "salary": {
        "p25": 172000,
        "p50": 199600,
        "p75": 215500,
        "mean": 194765,
        "p10": 152000,
        "p90": 230500
      },
      "aip": {
        "p25": 18975,
        "p50": 30300,
        "p75": 41925,
        "mean": 31648
      },
      "tc": {
        "p25": 198900,
        "p50": 228300,
        "p75": 259000
      }
    },
    "Customer": {
      "count": 73,
      "salary": {
        "p25": 169461,
        "p50": 193800,
        "p75": 206100,
        "mean": 189592,
        "p10": 155120,
        "p90": 213920
      },
      "aip": {
        "p25": 21600,
        "p50": 27800,
        "p75": 35100,
        "mean": 29022
      },
      "tc": {
        "p25": 196961,
        "p50": 218950,
        "p75": 239100
      }
    },
    "Human Capital": {
      "count": 66,
      "salary": {
        "p25": 168748,
        "p50": 188150,
        "p75": 199750,
        "mean": 184693,
        "p10": 153250,
        "p90": 211500
      },
      "aip": {
        "p25": 18500,
        "p50": 25750,
        "p75": 33750,
        "mean": 27218
      },
      "tc": {
        "p25": 199000,
        "p50": 212400,
        "p75": 231225
      }
    },
    "Enterprise Performance": {
      "count": 59,
      "salary": {
        "p25": 174900,
        "p50": 189000,
        "p75": 197700,
        "mean": 185548,
        "p10": 162420,
        "p90": 210300
      },
      "aip": {
        "p25": 17400,
        "p50": 26200,
        "p75": 35975,
        "mean": 26963
      },
      "tc": {
        "p25": 194200,
        "p50": 218000,
        "p75": 233200
      }
    },
    "Cyber": {
      "count": 35,
      "salary": {
        "p25": 161050,
        "p50": 171400,
        "p75": 180300,
        "mean": 170776,
        "p10": 146907,
        "p90": 202960
      },
      "aip": {
        "p25": 15600,
        "p50": 20000,
        "p75": 28600,
        "mean": 22791
      },
      "tc": {
        "p25": 182250,
        "p50": 190314,
        "p75": 205400
      }
    },
    "Other": {
      "count": 43,
      "salary": {
        "p25": 132350,
        "p50": 150500,
        "p75": 183500,
        "mean": 156283,
        "p10": 125500,
        "p90": 208440
      },
      "aip": {
        "p25": 8050,
        "p50": 12500,
        "p75": 19250,
        "mean": 15720
      },
      "tc": {
        "p25": 142900,
        "p50": 160500,
        "p75": 205100
      }
    }
  },
  "Senior Manager / Specialist Leader": {
    "AI & Engineering": {
      "count": 45,
      "salary": {
        "p25": 225000,
        "p50": 237400,
        "p75": 259300,
        "mean": 236907,
        "p10": 208200,
        "p90": 271200
      },
      "aip": {
        "p25": 35000,
        "p50": 47000,
        "p75": 54000,
        "mean": 46111
      },
      "tc": {
        "p25": 271200,
        "p50": 285000,
        "p75": 310500
      }
    },
    "Strategy & Transactions": {
      "count": 36,
      "salary": {
        "p25": 220150,
        "p50": 248900,
        "p75": 269925,
        "mean": 243076,
        "p10": 186850,
        "p90": 295200
      },
      "aip": {
        "p25": 30525,
        "p50": 46200,
        "p75": 71100,
        "mean": 52117
      },
      "tc": {
        "p25": 254100,
        "p50": 289250,
        "p75": 350525
      }
    }
  }
};

export const USDC_STATS = {
  "Consultant / Staff": {
    "USDC": {
      "count": 34,
      "salary": {
        "p25": 85175,
        "p50": 93900,
        "p75": 105525
      }
    },
    "Core": {
      "count": 341,
      "salary": {
        "p25": 101000,
        "p50": 106700,
        "p75": 115800
      }
    }
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "USDC": {
      "count": 42,
      "salary": {
        "p25": 113275,
        "p50": 117800,
        "p75": 125300
      }
    },
    "Core": {
      "count": 481,
      "salary": {
        "p25": 122200,
        "p50": 137200,
        "p75": 152300
      }
    }
  },
  "Manager / Specialist Master": {
    "USDC": {
      "count": 20,
      "salary": {
        "p25": 148075,
        "p50": 160000,
        "p75": 162950
      }
    },
    "Core": {
      "count": 416,
      "salary": {
        "p25": 166275,
        "p50": 188550,
        "p75": 204000
      }
    }
  }
};

export const MBA_STATS = {
  "Senior Consultant / Specialist Senior / Senior": {
    "MBA": {
      "count": 76,
      "salary": {
        "p25": 132300,
        "p50": 159500,
        "p75": 183600,
        "mean": 155359,
        "p10": 109650,
        "p90": 189500
      },
      "aip": {
        "p25": 8600,
        "p50": 12400,
        "p75": 16900,
        "mean": 12742
      },
      "tc": {
        "p25": 141375,
        "p50": 169450,
        "p75": 197522
      }
    },
    "NonMBA": {
      "count": 501,
      "salary": {
        "p25": 120900,
        "p50": 135500,
        "p75": 148000,
        "mean": 135640,
        "p10": 114200,
        "p90": 162800
      },
      "aip": {
        "p25": 8000,
        "p50": 11950,
        "p75": 15875,
        "mean": 12540
      },
      "tc": {
        "p25": 130800,
        "p50": 148000,
        "p75": 163000
      }
    }
  },
  "Manager / Specialist Master": {
    "MBA": {
      "count": 129,
      "salary": {
        "p25": 178000,
        "p50": 201700,
        "p75": 213200,
        "mean": 197086,
        "p10": 161560,
        "p90": 228700
      },
      "aip": {
        "p25": 17300,
        "p50": 28200,
        "p75": 39850,
        "mean": 30081
      },
      "tc": {
        "p25": 197500,
        "p50": 230400,
        "p75": 252200
      }
    },
    "NonMBA": {
      "count": 386,
      "salary": {
        "p25": 159400,
        "p50": 181000,
        "p75": 198525,
        "mean": 177908,
        "p10": 145000,
        "p90": 210900
      },
      "aip": {
        "p25": 15900,
        "p50": 23400,
        "p75": 32600,
        "mean": 24794
      },
      "tc": {
        "p25": 178100,
        "p50": 204100,
        "p75": 227000
      }
    }
  },
  "Senior Manager / Specialist Leader": {
    "MBA": {
      "count": 67,
      "salary": {
        "p25": 219000,
        "p50": 236400,
        "p75": 255000,
        "mean": 235938,
        "p10": 201000,
        "p90": 280960
      },
      "aip": {
        "p25": 31300,
        "p50": 47000,
        "p75": 55150,
        "mean": 47243
      },
      "tc": {
        "p25": 252000,
        "p50": 282100,
        "p75": 313950
      }
    },
    "NonMBA": {
      "count": 135,
      "salary": {
        "p25": 213500,
        "p50": 232000,
        "p75": 254200,
        "mean": 228899,
        "p10": 186240,
        "p90": 270300
      },
      "aip": {
        "p25": 25250,
        "p50": 40400,
        "p75": 51100,
        "mean": 41311
      },
      "tc": {
        "p25": 245000,
        "p50": 275000,
        "p75": 298000
      }
    }
  }
};

export const MBA_PREMIUM = {
  "Senior Consultant / Specialist Senior / Senior": {
    "mba": {
      "n": 76,
      "median": 159500
    },
    "bachelors": {
      "n": 351,
      "median": 135600
    },
    "delta": 23900,
    "deltaPct": 0.176
  },
  "Manager / Specialist Master": {
    "mba": {
      "n": 129,
      "median": 201700
    },
    "bachelors": {
      "n": 232,
      "median": 183000
    },
    "delta": 18700,
    "deltaPct": 0.102
  },
  "Senior Manager / Specialist Leader": {
    "mba": {
      "n": 67,
      "median": 236400
    },
    "bachelors": {
      "n": 76,
      "median": 234600
    },
    "delta": 1800,
    "deltaPct": 0.008
  }
};

export const YEARS_AT_LEVEL_MANAGER = {
  "1": {
    "n": 119,
    "median": 179600
  },
  "2": {
    "n": 117,
    "median": 188700
  },
  "3": {
    "n": 169,
    "median": 186100
  },
  "4": {
    "n": 69,
    "median": 190900
  },
  "5": {
    "n": 15,
    "median": 207000
  }
};

export const PROMOTION_RAISES = {
  "Consultant / Staff": {
    "n": 95,
    "median": 0.0991,
    "fromLabel": "Analyst",
    "toLabel": "Consultant"
  },
  "Senior Consultant / Specialist Senior / Senior": {
    "n": 203,
    "median": 0.1375,
    "fromLabel": "Consultant",
    "toLabel": "Senior Consultant"
  },
  "Manager / Specialist Master": {
    "n": 123,
    "median": 0.1548,
    "fromLabel": "Senior Consultant",
    "toLabel": "Manager"
  },
  "Senior Manager / Specialist Leader": {
    "n": 54,
    "median": 0.0959,
    "fromLabel": "Manager",
    "toLabel": "Senior Manager"
  }
};

export const NON_PROMOTION_RAISE = {
  "n": 1271,
  "median": 0.056,
  "p25": 0.0375,
  "p75": 0.0763
};

export const LEVELS = Object.keys(LEVEL_STATS);
export const BUSINESSES = ["Consulting Services", "Audit & Assurance", "Tax", "Enabling Areas"];
export const PORTFOLIOS = ["AI & Engineering", "Strategy & Transactions", "Customer", "Human Capital", "Enterprise Performance", "Cyber", "Finance Transformation", "Regulatory, Risk & Forensic", "Other"];
export const GPS_COMM = ["Commercial", "GPS"];
export const EDUCATION_LEVELS = ["Bachelor\u0027s", "Non-MBA Master\u0027s", "MBA", "PhD / Other"];
export const BUSINESS_MODELS = ["Core (Traditional)", "USDC"];
export const NEXT_LEVEL = {"Analyst / Jr Staff": "Consultant / Staff", "Consultant / Staff": "Senior Consultant / Specialist Senior / Senior", "Senior Consultant / Specialist Senior / Senior": "Manager / Specialist Master", "Manager / Specialist Master": "Senior Manager / Specialist Leader"};

export const totalRespondents = 1765;
