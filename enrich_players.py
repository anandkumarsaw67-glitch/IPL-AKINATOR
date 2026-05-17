"""
Maps IPL dataset player names to Akinator player IDs and adds real stats.
Outputs enriched players.js with batting/bowling stats from the dataset.
"""
import json

# Load analyzed stats
with open(r"c:\Users\HP\OneDrive\Desktop\Akinator\ipl_player_stats.json", "r", encoding="utf-8") as f:
    stats = json.load(f)

# Map dataset names -> Akinator player IDs
NAME_MAP = {
    "V Kohli": "virat_kohli",
    "RG Sharma": "rohit_sharma",
    "MS Dhoni": "ms_dhoni",
    "JJ Bumrah": "jasprit_bumrah",
    "HH Pandya": "hardik_pandya",
    "KL Rahul": "kl_rahul",
    "SA Yadav": "suryakumar_yadav",
    "RR Pant": "rishabh_pant",
    "Shubman Gill": "shubman_gill",
    "RA Jadeja": "ravindra_jadeja",
    "YS Chahal": "yuzvendra_chahal",
    "Mohammed Shami": "mohammed_shami",
    "PJ Cummins": "pat_cummins",
    "JC Buttler": "jos_buttler",
    "DA Warner": "david_warner",
    "AB de Villiers": "ab_de_villiers",
    "CH Gayle": "chris_gayle",
    "F du Plessis": "faf_du_plessis",
    "Rashid Khan": "rashid_khan",
    "AD Russell": "andre_russell",
    "SP Narine": "sunil_narine",
    "KA Pollard": "kieron_pollard",
    "GJ Maxwell": "glenn_maxwell",
    "Q de Kock": "quinton_de_kock",
    "KD Karthik": "dinesh_karthik",
    "SV Samson": "sanju_samson",
    "AR Patel": "axar_patel",
    "Ishan Kishan": "ishan_kishan",
    "SS Iyer": "shreyas_iyer",
    "RD Gaikwad": "ruturaj_gaikwad",
    "YBK Jaiswal": "yashasvi_jaiswal",
    "Washington Sundar": "washington_sundar",
    "TA Boult": "trent_boult",
    "MA Starc": "mitchell_starc",
    "SM Curran": "sam_curran",
    "N Pooran": "nicholas_pooran",
    "Tilak Varma": "tilak_varma",
    "MA Agarwal": "mayank_agarwal",
    "KS Williamson": "kane_williamson",
    "TM Head": "travis_head",
    "H Klaasen": "heinrich_klaasen",
    "Abhishek Sharma": "abhishek_sharma",
    "Rinku Singh": "rinku_singh",
    "R Parag": "riyan_parag",
    "PD Salt": "phil_salt",
    "V Chakravarthy": "varun_chakravarthy",
    "Arshdeep Singh": "arshdeep_singh",
    "DL Chahar": "deepak_chahar",
    "T Natarajan": "t_natarajan",
    "JM Fraser-McGurk": "jake_fraser_mcgurk",
    "T Stubbs": "tristan_stubbs",
    "Vaibhav Suryavanshi": "vaibhav_suryavanshi",
    "Mayank Yadav": "mayank_yadav",
    "Nitish Kumar Reddy": "nitish_kumar_reddy",
    "Shashank Singh": "shashank_singh",
    "RRA Ravindra": "rachin_ravindra",
    "Ayush Mhatre": "ayush_mhatre",
    "SK Raina": "suresh_raina",
    "S Dhawan": "shikhar_dhawan",
    "AM Rahane": "ajinkya_rahane",
    "G Gambhir": "gautam_gambhir",
    "B Kumar": "bhuvneshwar_kumar",
    "DJ Bravo": "dwayne_bravo",
    "SL Malinga": "lasith_malinga",
    "R Ashwin": "ravichandran_ashwin",
    "PP Chawla": "piyush_chawla",
    "A Mishra": "amit_mishra",
    "Harbhajan Singh": "harbhajan_singh",
    "RV Uthappa": "robin_uthappa",
    "AT Rayudu": "ambati_rayudu",
    "MK Pandey": "manish_pandey",
    "SR Watson": "shane_watson",
    "MEK Hussey": "mike_hussey",
    "JH Kallis": "jacques_kallis",
    "M Vijay": "murali_vijay",
    "KA Jamieson": "kyle_jamieson",
    "Mohammed Siraj": "mohammed_siraj",
    "T Alexander": "tim_alexander",
    "Kuldeep Yadav": "kuldeep_yadav",
    "Harshal Patel": "harshal_patel",
    "HV Patel": "harshal_patel",
    "UT Yadav": "umesh_yadav",
    "Sandeep Sharma": "sandeep_sharma",
}

# Build stats lookup by player ID
stats_by_id = {}
for s in stats:
    pid = NAME_MAP.get(s["name"])
    if pid:
        stats_by_id[pid] = s

# Print mapping results
mapped = len(stats_by_id)
print(f"Mapped {mapped} players from dataset to Akinator knowledge base")

# Show stats for existing players
print("\n--- Stats for current Akinator players ---")
print(f"{'ID':<28} {'Runs':<7} {'Avg':<7} {'SR':<8} {'Wkts':<6} {'6s':<6} {'50s':<5} {'100s':<5} {'PoM':<5} {'Teams'}")
print("-" * 110)
for pid, s in sorted(stats_by_id.items(), key=lambda x: x[1]["total_runs"], reverse=True):
    print(f"{pid:<28} {s['total_runs']:<7} {s['batting_avg']:<7} {s['batting_sr']:<8} {s['total_wickets']:<6} {s['sixes']:<6} {s['fifties']:<5} {s['hundreds']:<5} {s['player_of_match']:<5} {', '.join(s['teams'])}")

# Find top players NOT in current Akinator
print("\n--- TOP MISSING PLAYERS (should be added) ---")
unmapped_top = [s for s in stats if s["name"] not in NAME_MAP and s["total_runs"] > 2000]
for s in unmapped_top[:20]:
    print(f"  {s['name']:<25} Runs:{s['total_runs']} Wkts:{s['total_wickets']} Teams:{', '.join(s['teams'])}")

# Save mapped stats for JS consumption
output = {}
for pid, s in stats_by_id.items():
    output[pid] = {
        "totalRuns": s["total_runs"],
        "battingAvg": s["batting_avg"],
        "battingSR": s["batting_sr"],
        "fours": s["fours"],
        "sixes": s["sixes"],
        "highScore": s["high_score"],
        "fifties": s["fifties"],
        "hundreds": s["hundreds"],
        "totalWickets": s["total_wickets"],
        "bowlingAvg": s["bowling_avg"],
        "bowlingEcon": s["bowling_econ"],
        "deathWickets": s["death_wickets"],
        "ppWickets": s["powerplay_wickets"],
        "avgBatPos": s["avg_bat_pos"],
        "playerOfMatch": s["player_of_match"],
        "seasonsPlayed": s["seasons_played"],
        "datasetTeams": s["teams"],
    }

with open(r"c:\Users\HP\OneDrive\Desktop\Akinator\player_stats_mapped.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nSaved mapped stats to player_stats_mapped.json")
