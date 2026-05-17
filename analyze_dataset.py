"""
🏏 IPL Dataset Analyzer — Extract player stats for Akinator
Reads ball-by-ball IPL data (2008-2025) and generates enriched player profiles
with real statistics for better guessing accuracy.
"""

import csv
import json
from collections import defaultdict

CSV_PATH = r"C:\Users\HP\.cache\kagglehub\datasets\chaitu20\ipl-dataset2008-2025\versions\2\IPL.csv"

# Team name normalization map
TEAM_ABBR = {
    "Mumbai Indians": "MI",
    "Chennai Super Kings": "CSK",
    "Royal Challengers Bangalore": "RCB",
    "Royal Challengers Bengaluru": "RCB",
    "Kolkata Knight Riders": "KKR",
    "Sunrisers Hyderabad": "SRH",
    "Delhi Capitals": "DC",
    "Delhi Daredevils": "DD",
    "Rajasthan Royals": "RR",
    "Gujarat Titans": "GT",
    "Lucknow Super Giants": "LSG",
    "Kings XI Punjab": "KXIP",
    "Punjab Kings": "KXIP",
    "Rising Pune Supergiant": "RPS",
    "Rising Pune Supergiants": "RPS",
    "Deccan Chargers": "Deccan",
    "Kochi Tuskers Kerala": "KTK",
    "Gujarat Lions": "GL",
    "Pune Warriors": "PW",
}

def normalize_team(team):
    return TEAM_ABBR.get(team, team)


def analyze():
    print("📂 Loading IPL dataset...")
    
    # Per-player aggregated stats
    batters = defaultdict(lambda: {
        "runs": 0, "balls": 0, "fours": 0, "sixes": 0, "innings": set(),
        "teams_bat": set(), "dismissals": 0, "not_outs": 0,
        "bat_positions": [], "seasons": set(), "high_score": 0,
        "fifties": 0, "hundreds": 0, "match_runs": defaultdict(int),
        "potm": 0,
    })
    bowlers = defaultdict(lambda: {
        "wickets": 0, "runs_conceded": 0, "balls_bowled": 0, "innings": set(),
        "teams_bowl": set(), "overs_in_pp": 0, "overs_in_death": 0,
        "wickets_pp": 0, "wickets_death": 0, "seasons": set(),
    })
    
    # Track per-match batting scores for high scores / 50s / 100s
    match_bat_scores = defaultdict(lambda: defaultdict(int))   # match_id -> batter -> runs
    match_bat_balls  = defaultdict(lambda: defaultdict(int))
    match_bat_team   = defaultdict(lambda: defaultdict(str))
    
    player_of_match_count = defaultdict(int)
    
    row_count = 0
    
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row_count += 1
            mid = row["match_id"]
            season = row["season"]
            batter = row["batter"]
            bowler = row["bowler"]
            bat_team = row["batting_team"]
            bowl_team = row["bowling_team"]
            over_num = int(row["over"]) if row["over"] else 0
            runs_batter = int(row["runs_batter"]) if row["runs_batter"] else 0
            valid = row["valid_ball"] == "1"
            wicket_kind = row.get("wicket_kind", "")
            player_out = row.get("player_out", "")
            bat_pos = row.get("bat_pos", "")
            potm = row.get("player_of_match", "")
            runs_bowler = int(row["runs_bowler"]) if row.get("runs_bowler") else 0
            
            # --- Batting stats ---
            b = batters[batter]
            b["runs"] += runs_batter
            if valid:
                b["balls"] += 1
            if runs_batter == 4:
                b["fours"] += 1
            if runs_batter == 6:
                b["sixes"] += 1
            b["innings"].add(mid)
            b["teams_bat"].add(normalize_team(bat_team))
            b["seasons"].add(season)
            if bat_pos and bat_pos.isdigit():
                b["bat_positions"].append(int(bat_pos))
            
            match_bat_scores[mid][batter] += runs_batter
            if valid:
                match_bat_balls[mid][batter] = match_bat_balls[mid].get(batter, 0) + 1
            match_bat_team[mid][batter] = normalize_team(bat_team)
            
            # --- Bowling stats ---
            if bowler:
                bw = bowlers[bowler]
                if valid:
                    bw["balls_bowled"] += 1
                bw["runs_conceded"] += runs_bowler
                bw["innings"].add(mid)
                bw["teams_bowl"].add(normalize_team(bowl_team))
                bw["seasons"].add(season)
                
                # Powerplay (overs 0-5) and death (overs 16-19)
                if over_num <= 5:
                    if valid:
                        bw["overs_in_pp"] += 1
                    if wicket_kind and player_out and bowler == row.get("bowler"):
                        if wicket_kind in ("bowled", "caught", "lbw", "stumped", "caught and bowled", "hit wicket"):
                            bw["wickets_pp"] += 1
                if over_num >= 16:
                    if valid:
                        bw["overs_in_death"] += 1
                    if wicket_kind and player_out:
                        if wicket_kind in ("bowled", "caught", "lbw", "stumped", "caught and bowled", "hit wicket"):
                            bw["wickets_death"] += 1
                
                if wicket_kind and player_out:
                    if wicket_kind in ("bowled", "caught", "lbw", "stumped", "caught and bowled", "hit wicket"):
                        bw["wickets"] += 1
            
            # Dismissals
            if wicket_kind and player_out:
                if player_out in batters:
                    batters[player_out]["dismissals"] += 1
            
            # Player of the match
            if potm:
                player_of_match_count[potm] = player_of_match_count.get(potm, 0)
                # We only want to count once per match, handled below

    print(f"✅ Processed {row_count:,} ball-by-ball rows")
    
    # Count Player of Match per unique match
    potm_set = set()
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            mid = row["match_id"]
            potm = row.get("player_of_match", "")
            if potm and (mid, potm) not in potm_set:
                potm_set.add((mid, potm))
                player_of_match_count[potm] = player_of_match_count.get(potm, 0) + 1

    # Calculate per-match high scores, 50s, 100s
    for mid, scores in match_bat_scores.items():
        for batter, runs in scores.items():
            if batter in batters:
                if runs > batters[batter]["high_score"]:
                    batters[batter]["high_score"] = runs
                if runs >= 100:
                    batters[batter]["hundreds"] += 1
                elif runs >= 50:
                    batters[batter]["fifties"] += 1

    # --- Build comprehensive player profiles ---
    all_players = set(list(batters.keys()) + list(bowlers.keys()))
    print(f"🏏 Found {len(all_players)} unique players in dataset")
    
    profiles = []
    for name in sorted(all_players):
        bat = batters.get(name)
        bowl = bowlers.get(name)
        
        total_runs = bat["runs"] if bat else 0
        total_balls_faced = bat["balls"] if bat else 0
        total_innings_bat = len(bat["innings"]) if bat else 0
        total_fours = bat["fours"] if bat else 0
        total_sixes = bat["sixes"] if bat else 0
        high_score = bat["high_score"] if bat else 0
        fifties = bat["fifties"] if bat else 0
        hundreds = bat["hundreds"] if bat else 0
        
        total_wickets = bowl["wickets"] if bowl else 0
        total_balls_bowled = bowl["balls_bowled"] if bowl else 0
        total_runs_conceded = bowl["runs_conceded"] if bowl else 0
        total_innings_bowl = len(bowl["innings"]) if bowl else 0
        
        teams = set()
        if bat:
            teams.update(bat["teams_bat"])
        if bowl:
            teams.update(bowl["teams_bowl"])
        
        seasons = set()
        if bat:
            seasons.update(bat["seasons"])
        if bowl:
            seasons.update(bowl["seasons"])
        
        # Batting average / SR
        bat_avg = round(total_runs / max(1, total_innings_bat), 2)
        bat_sr = round((total_runs / max(1, total_balls_faced)) * 100, 2)
        
        # Bowling average / economy
        bowl_avg = round(total_runs_conceded / max(1, total_wickets), 2) if total_wickets > 0 else 999
        bowl_econ = round((total_runs_conceded / max(1, total_balls_bowled)) * 6, 2) if total_balls_bowled > 0 else 0
        
        # Batting position analysis
        avg_bat_pos = 0
        if bat and bat["bat_positions"]:
            avg_bat_pos = round(sum(bat["bat_positions"]) / len(bat["bat_positions"]), 1)
        
        # Death bowling specialist
        death_wickets = bowl["wickets_death"] if bowl else 0
        pp_wickets = bowl["wickets_pp"] if bowl else 0
        
        potm = player_of_match_count.get(name, 0)
        
        profiles.append({
            "name": name,
            "teams": sorted(teams),
            "seasons_played": len(seasons),
            "total_runs": total_runs,
            "batting_innings": total_innings_bat,
            "batting_avg": bat_avg,
            "batting_sr": bat_sr,
            "fours": total_fours,
            "sixes": total_sixes,
            "high_score": high_score,
            "fifties": fifties,
            "hundreds": hundreds,
            "total_wickets": total_wickets,
            "bowling_innings": total_innings_bowl,
            "bowling_avg": bowl_avg,
            "bowling_econ": bowl_econ,
            "death_wickets": death_wickets,
            "powerplay_wickets": pp_wickets,
            "avg_bat_pos": avg_bat_pos,
            "player_of_match": potm,
        })
    
    # Sort by total runs (most impactful first)
    profiles.sort(key=lambda x: x["total_runs"], reverse=True)
    
    # Save to JSON
    output_path = r"c:\Users\HP\OneDrive\Desktop\Akinator\ipl_player_stats.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)
    
    print(f"\n📊 Saved {len(profiles)} player profiles to ipl_player_stats.json")
    print("\n🏆 TOP 20 Run Scorers:")
    print(f"{'#':<4} {'Name':<25} {'Runs':<8} {'Avg':<8} {'SR':<8} {'50s':<5} {'100s':<5} {'6s':<6} {'Wkt':<5} {'Teams'}")
    print("-" * 110)
    for i, p in enumerate(profiles[:20], 1):
        print(f"{i:<4} {p['name']:<25} {p['total_runs']:<8} {p['batting_avg']:<8} {p['batting_sr']:<8} {p['fifties']:<5} {p['hundreds']:<5} {p['sixes']:<6} {p['total_wickets']:<5} {', '.join(p['teams'])}")
    
    print("\n🎯 TOP 15 Wicket Takers:")
    by_wickets = sorted(profiles, key=lambda x: x["total_wickets"], reverse=True)
    print(f"{'#':<4} {'Name':<25} {'Wkts':<8} {'Avg':<8} {'Econ':<8} {'Death W':<8} {'PP W':<8} {'Teams'}")
    print("-" * 100)
    for i, p in enumerate(by_wickets[:15], 1):
        print(f"{i:<4} {p['name']:<25} {p['total_wickets']:<8} {p['bowling_avg']:<8} {p['bowling_econ']:<8} {p['death_wickets']:<8} {p['powerplay_wickets']:<8} {', '.join(p['teams'])}")

    return profiles


if __name__ == "__main__":
    analyze()
