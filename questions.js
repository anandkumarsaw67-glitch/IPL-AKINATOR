// ❓ IPL Akinator — Question Bank (Enhanced v2)
const QUESTIONS = [
  {
    id: "q_indian",
    text: "Is your player from India (not an overseas player)?",
    attribute: "country",
    check: (p) => p.country === "India"
  },
  {
    id: "q_batsman",
    text: "Is your player primarily a batsman (not a bowler or all-rounder)?",
    attribute: "role",
    check: (p) => p.role === "Batsman"
  },
  {
    id: "q_bowler",
    text: "Is your player primarily a bowler?",
    attribute: "role",
    check: (p) => p.role === "Bowler"
  },
  {
    id: "q_allrounder",
    text: "Is your player an all-rounder (bats AND bowls regularly)?",
    attribute: "isAllRounder",
    check: (p) => p.isAllRounder === true
  },
  {
    id: "q_keeper",
    text: "Is your player a wicketkeeper?",
    attribute: "isWicketkeeper",
    check: (p) => p.isWicketkeeper === true
  },
  {
    id: "q_opener",
    text: "Does your player open the batting (bat at position 1 or 2)?",
    attribute: "isOpener",
    check: (p) => p.isOpener === true
  },
  {
    id: "q_toporder",
    text: "Does your player bat in the top order (opens or bats at #3)?",
    attribute: "battingPosition",
    check: (p) => p.battingPosition === "Top"
  },
  {
    id: "q_finisher",
    text: "Is your player known as a finisher or death-over batsman?",
    attribute: "isFinisher",
    check: (p) => p.isFinisher === true
  },
  {
    id: "q_captain",
    text: "Has your player ever captained an IPL team?",
    attribute: "isCaptain",
    check: (p) => p.isCaptain === true
  },
  {
    id: "q_lefthanded",
    text: "Is your player left-handed (bats or bowls left-arm)?",
    attribute: "isLeftHanded",
    check: (p) => p.isLeftHanded === true
  },
  {
    id: "q_spinner",
    text: "Is your player a spinner (leg-spin, off-spin, etc.)?",
    attribute: "isSpin",
    check: (p) => p.isSpin === true
  },
  {
    id: "q_fastbowler",
    text: "Is your player a fast / pace bowler?",
    attribute: "isFast",
    check: (p) => p.isFast === true
  },
  {
    id: "q_aggressive",
    text: "Is your player known for an aggressive, attacking batting style?",
    attribute: "isAggressive",
    check: (p) => p.isAggressive === true
  },
  {
    id: "q_active",
    text: "Is your player currently active in IPL (still playing)?",
    attribute: "isActive",
    check: (p) => p.isActive === true
  },
  {
    id: "q_titles",
    text: "Has your player won at least one IPL title?",
    attribute: "titles",
    check: (p) => p.titles > 0
  },
  {
    id: "q_hastest",
    text: "Has your player played Test cricket for their country?",
    attribute: "hasPlayedTest",
    check: (p) => p.hasPlayedTest === true
  },
  {
    id: "q_death_bowler",
    text: "Is your player a death-over specialist bowler?",
    attribute: "isDeathBowler",
    check: (p) => p.isDeathBowler === true
  },
  {
    id: "q_powerplay",
    text: "Is your player a powerplay specialist (bats or bowls in first 6 overs)?",
    attribute: "isPowerplaySpecialist",
    check: (p) => p.isPowerplaySpecialist === true
  },
  {
    id: "q_young",
    text: "Is your player 26 years old or younger (a young rising star)?",
    attribute: "isYoung",
    check: (p) => p.isYoung === true
  },
  {
    id: "q_multi_team",
    text: "Has your player played for 3 or more different IPL franchises?",
    attribute: "multiTeam",
    check: (p) => p.teams.length >= 3
  },
  // ── Team Questions ─────────────────────────────────────────────
  {
    id: "q_mi",
    text: "Has your player ever played for Mumbai Indians (MI)?",
    attribute: "teams",
    check: (p) => p.teams.includes("MI")
  },
  {
    id: "q_csk",
    text: "Has your player ever played for Chennai Super Kings (CSK)?",
    attribute: "teams",
    check: (p) => p.teams.includes("CSK")
  },
  {
    id: "q_rcb",
    text: "Has your player ever played for Royal Challengers Bangalore (RCB)?",
    attribute: "teams",
    check: (p) => p.teams.includes("RCB")
  },
  {
    id: "q_kkr",
    text: "Has your player ever played for Kolkata Knight Riders (KKR)?",
    attribute: "teams",
    check: (p) => p.teams.includes("KKR")
  },
  {
    id: "q_srh",
    text: "Has your player ever played for Sunrisers Hyderabad (SRH)?",
    attribute: "teams",
    check: (p) => p.teams.includes("SRH")
  },
  {
    id: "q_dc",
    text: "Has your player ever played for Delhi Capitals / Delhi Daredevils (DC)?",
    attribute: "teams",
    check: (p) => p.teams.includes("DC") || p.teams.includes("DD")
  },
  {
    id: "q_rr",
    text: "Has your player ever played for Rajasthan Royals (RR)?",
    attribute: "teams",
    check: (p) => p.teams.includes("RR")
  },
  {
    id: "q_gt",
    text: "Has your player ever played for Gujarat Titans (GT)?",
    attribute: "teams",
    check: (p) => p.teams.includes("GT")
  },
  {
    id: "q_lsg",
    text: "Has your player ever played for Lucknow Super Giants (LSG)?",
    attribute: "teams",
    check: (p) => p.teams.includes("LSG")
  },
  {
    id: "q_kxip",
    text: "Has your player ever played for Punjab Kings / Kings XI Punjab (KXIP)?",
    attribute: "teams",
    check: (p) => p.teams.includes("KXIP")
  }
];
