// 🏏 IPL Player Knowledge Base — v2 (Corrected & Enhanced)
const PLAYERS = [
  {
    id: "virat_kohli", name: "Virat Kohli", emoji: "👑",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["RCB"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "rohit_sharma", name: "Rohit Sharma", emoji: "🏆",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["Deccan", "MI"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 5, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#004BA0"
  },
  {
    id: "ms_dhoni", name: "MS Dhoni", emoji: "🧢",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Finisher", teams: ["CSK", "RPS"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 5, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FFFF00"
  },
  {
    id: "jasprit_bumrah", name: "Jasprit Bumrah", emoji: "💥",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["MI"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 5, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#004BA0"
  },
  {
    id: "hardik_pandya", name: "Hardik Pandya", emoji: "⚡",
    country: "India", role: "All-rounder",
    battingPosition: "Finisher", teams: ["MI", "GT"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 5, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#1C1C1C"
  },
  {
    id: "kl_rahul", name: "KL Rahul", emoji: "🎯",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["RCB", "KXIP", "LSG"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#A72056"
  },
  {
    id: "suryakumar_yadav", name: "Suryakumar Yadav", emoji: "🌊",
    country: "India", role: "Batsman",
    battingPosition: "Middle", teams: ["MI"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 5, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#004BA0"
  },
  {
    id: "rishabh_pant", name: "Rishabh Pant", emoji: "🧤",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Middle", teams: ["DC"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#0078BC"
  },
  {
    id: "shubman_gill", name: "Shubman Gill", emoji: "🌟",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["KKR", "GT"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: true, teamColor: "#1A1A2E"
  },
  {
    id: "ravindra_jadeja", name: "Ravindra Jadeja", emoji: "🗡️",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["RR", "CSK", "RPS"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 3, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FFFF00"
  },
  {
    id: "yuzvendra_chahal", name: "Yuzvendra Chahal", emoji: "🔄",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["RCB", "RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#EA1A85"
  },
  {
    id: "mohammed_shami", name: "Mohammed Shami", emoji: "🔥",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["KKR", "DD", "KXIP", "GT"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#1A1A2E"
  },
  {
    id: "pat_cummins", name: "Pat Cummins", emoji: "🦘",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Middle", teams: ["KKR", "SRH"],
    isCaptain: true, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "jos_buttler", name: "Jos Buttler", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "Overseas", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#EA1A85"
  },
  {
    id: "david_warner", name: "David Warner", emoji: "🦁",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["SRH", "DC"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: false,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "ab_de_villiers", name: "AB de Villiers", emoji: "🦸",
    country: "Overseas", role: "Batsman",
    battingPosition: "Middle", teams: ["RCB"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: false,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "chris_gayle", name: "Chris Gayle", emoji: "🌪️",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["KKR", "RCB", "KXIP"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: false,
    titles: 2, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "faf_du_plessis", name: "Faf du Plessis", emoji: "🦅",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["CSK", "RCB"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 2, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "rashid_khan", name: "Rashid Khan", emoji: "🕷️",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Middle", teams: ["SRH", "GT"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "andre_russell", name: "Andre Russell", emoji: "💣",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Finisher", teams: ["KKR"],
    isCaptain: false, isDeathBowler: true, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 3, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#3A225D"
  },
  {
    id: "sunil_narine", name: "Sunil Narine", emoji: "🎩",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Top", teams: ["KKR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 3, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: false,
    isOpener: true, isYoung: false, teamColor: "#3A225D"
  },
  {
    id: "kieron_pollard", name: "Kieron Pollard", emoji: "🏋️",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Finisher", teams: ["MI"],
    isCaptain: false, isDeathBowler: true, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: false,
    titles: 5, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#004BA0"
  },
  {
    id: "glenn_maxwell", name: "Glenn Maxwell", emoji: "🌀",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Middle", teams: ["KXIP", "DC", "RCB"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "quinton_de_kock", name: "Quinton de Kock", emoji: "🧲",
    country: "Overseas", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["MI", "LSG"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 3, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#A72056"
  },
  {
    id: "dinesh_karthik", name: "Dinesh Karthik", emoji: "🎯",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Finisher", teams: ["DD", "KXIP", "KKR", "RCB"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: false,
    titles: 2, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#EC1C24"
  },
  {
    id: "sanju_samson", name: "Sanju Samson", emoji: "☀️",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["RR", "DD"],
    isCaptain: true, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: true, isYoung: false, teamColor: "#EA1A85"
  },
  {
    id: "axar_patel", name: "Axar Patel", emoji: "🧩",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["KXIP", "DC"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#0078BC"
  },
  {
    id: "ishan_kishan", name: "Ishan Kishan", emoji: "⚡",
    country: "India", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["MI"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 1, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#004BA0"
  },
  {
    id: "shreyas_iyer", name: "Shreyas Iyer", emoji: "🏹",
    country: "India", role: "Batsman",
    battingPosition: "Middle", teams: ["DC", "KKR"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#3A225D"
  },
  {
    id: "ruturaj_gaikwad", name: "Ruturaj Gaikwad", emoji: "🌅",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["CSK"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 2, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#FFFF00"
  },
  {
    id: "yashasvi_jaiswal", name: "Yashasvi Jaiswal", emoji: "💎",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: true, teamColor: "#EA1A85"
  },
  {
    id: "washington_sundar", name: "Washington Sundar", emoji: "🌐",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["RCB", "SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: true, teamColor: "#FF822A"
  },
  {
    id: "trent_boult", name: "Trent Boult", emoji: "🌊",
    country: "Overseas", role: "Bowler",
    battingPosition: "None", teams: ["MI", "RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#EA1A85"
  },
  {
    id: "mitchell_starc", name: "Mitchell Starc", emoji: "🚀",
    country: "Overseas", role: "Bowler",
    battingPosition: "None", teams: ["KKR"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#3A225D"
  },
  {
    id: "sam_curran", name: "Sam Curran", emoji: "🦊",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Middle", teams: ["CSK", "KXIP"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FFFF00"
  },
  {
    id: "nicholas_pooran", name: "Nicholas Pooran", emoji: "🌺",
    country: "Overseas", role: "Wicketkeeper",
    battingPosition: "Middle", teams: ["KXIP", "SRH", "LSG"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#A72056"
  },
  {
    id: "tilak_varma", name: "Tilak Varma", emoji: "🌱",
    country: "India", role: "Batsman",
    battingPosition: "Middle", teams: ["MI"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#004BA0"
  },
  {
    id: "mayank_agarwal", name: "Mayank Agarwal", emoji: "🦉",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["KXIP", "SRH"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "kane_williamson", name: "Kane Williamson", emoji: "🧠",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["SRH", "GT"],
    isCaptain: true, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: false,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FF822A"
  },
  // ── IPL 2024 / 2025 New Stars ──────────────────────────────────
  {
    id: "travis_head", name: "Travis Head", emoji: "🦄",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "heinrich_klaasen", name: "Heinrich Klaasen", emoji: "💪",
    country: "Overseas", role: "Wicketkeeper",
    battingPosition: "Finisher", teams: ["SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "abhishek_sharma", name: "Abhishek Sharma", emoji: "🌠",
    country: "India", role: "All-rounder",
    battingPosition: "Top", teams: ["SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#FF822A"
  },
  {
    id: "rinku_singh", name: "Rinku Singh", emoji: "🔱",
    country: "India", role: "Batsman",
    battingPosition: "Finisher", teams: ["KKR"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#3A225D"
  },
  {
    id: "riyan_parag", name: "Riyan Parag", emoji: "🌿",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#EA1A85"
  },
  {
    id: "phil_salt", name: "Phil Salt", emoji: "🧂",
    country: "Overseas", role: "Wicketkeeper",
    battingPosition: "Top", teams: ["DC", "KKR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 1, isWicketkeeper: true, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#3A225D"
  },
  {
    id: "varun_chakravarthy", name: "Varun Chakravarthy", emoji: "🔮",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["KKR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 1, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#3A225D"
  },
  {
    id: "arshdeep_singh", name: "Arshdeep Singh", emoji: "🎯",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["KXIP"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#DC143C"
  },
  {
    id: "deepak_chahar", name: "Deepak Chahar", emoji: "🌪️",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["CSK", "RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: false, isActive: true,
    titles: 2, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: true,
    isOpener: false, isYoung: false, teamColor: "#EA1A85"
  },
  {
    id: "t_natarajan", name: "T Natarajan", emoji: "🎳",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["SRH"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#FF822A"
  },
  {
    id: "jake_fraser_mcgurk", name: "Jake Fraser-McGurk", emoji: "🦅",
    country: "Overseas", role: "Batsman",
    battingPosition: "Top", teams: ["DC"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#0078BC"
  },
  {
    id: "tristan_stubbs", name: "Tristan Stubbs", emoji: "🛡️",
    country: "Overseas", role: "Batsman",
    battingPosition: "Finisher", teams: ["MI"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
  },
  // ── IPL 2025 / 2026 Latest Stars ────────────────────────────────
  {
    id: "vaibhav_suryavanshi", name: "Vaibhav Suryavanshi", emoji: "👶",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["RR"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: true, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#EA1A85"
  },
  {
    id: "mayank_yadav", name: "Mayank Yadav", emoji: "⚡",
    country: "India", role: "Bowler",
    battingPosition: "None", teams: ["LSG"],
    isCaptain: false, isDeathBowler: true, isFinisher: false,
    isPowerplaySpecialist: false, isAggressive: false, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#A72056"
  },
  {
    id: "nitish_kumar_reddy", name: "Nitish Kumar Reddy", emoji: "🚀",
    country: "India", role: "All-rounder",
    battingPosition: "Middle", teams: ["SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: true,
    isAllRounder: true, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: true, teamColor: "#FF822A"
  },
  {
    id: "shashank_singh", name: "Shashank Singh", emoji: "💪",
    country: "India", role: "Batsman",
    battingPosition: "Finisher", teams: ["KXIP", "SRH"],
    isCaptain: false, isDeathBowler: false, isFinisher: true,
    isPowerplaySpecialist: false, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: false, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: false, isYoung: false, teamColor: "#DC143C"
  },
  {
    id: "rachin_ravindra", name: "Rachin Ravindra", emoji: "🥝",
    country: "Overseas", role: "All-rounder",
    battingPosition: "Top", teams: ["CSK"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: true, isLeftHanded: true, hasPlayedTest: true,
    isOpener: true, isYoung: true, teamColor: "#FFFF00"
  },
  {
    id: "ayush_mhatre", name: "Ayush Mhatre", emoji: "🦁",
    country: "India", role: "Batsman",
    battingPosition: "Top", teams: ["CSK"],
    isCaptain: false, isDeathBowler: false, isFinisher: false,
    isPowerplaySpecialist: true, isAggressive: true, isActive: true,
    titles: 0, isWicketkeeper: false, isSpin: true, isFast: false,
    isAllRounder: false, isLeftHanded: false, hasPlayedTest: false,
    isOpener: true, isYoung: true, teamColor: "#FFFF00"
  }
];
